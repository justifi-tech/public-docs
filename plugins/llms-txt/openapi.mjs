/**
 * Renders the bundled OpenAPI document as Markdown: one page per tag, plus the
 * introduction held in `info.description`. Named component schemas are listed once,
 * at the end of each page that uses them, instead of being expanded at every use.
 */
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

export const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const oneLine = (text) => (text ?? '').replace(/\s+/g, ' ').trim();

// <PullRight> is a Redoc layout tag and <br> only spaces sections apart on screen.
const cleanDescription = (text) =>
  (text ?? '').replace(/<\/?PullRight>|<br\s*\/?>/g, '').replace(/\n{3,}/g, '\n\n').trim();

const cell = (text) => oneLine(text).replace(/\|/g, '\\|');

// Redoc builds its anchors from tag names with spaces turned into dashes.
const redocTagAnchor = (tag) => `tag/${tag.replace(/ /g, '-')}`;

export function renderApiReference(spec, { referenceUrl }) {
  const server = spec.servers?.[0]?.url ?? '';

  const pointer = (ref) =>
    ref
      .slice(2)
      .split('/')
      .reduce((node, key) => node?.[key.replace(/~1/g, '/').replace(/~0/g, '~')], spec);
  const resolve = (node) => {
    while (node?.$ref) node = pointer(node.$ref);
    return node ?? {};
  };
  const componentName = (node) =>
    node?.$ref?.startsWith('#/components/schemas/') ? node.$ref.split('/').pop() : null;
  // `allOf: [$ref]` is how the spec attaches a description to a named schema.
  const named = (node) => {
    if (componentName(node)) return node;
    const members = resolve(node).allOf;
    return members?.length === 1 && componentName(members[0]) ? members[0] : null;
  };

  const renderPage = (render) => {
    const schemas = new Set();

    const merged = (node) => {
      const schema = resolve(node);
      if (!schema.allOf) return schema;
      const parts = [...schema.allOf.map(merged), schema];
      const properties = {};
      for (const part of parts) {
        for (const [name, property] of Object.entries(part.properties ?? {})) {
          properties[name] = properties[name] ? { ...resolve(properties[name]), ...resolve(property) } : property;
        }
      }
      return { ...schema, type: 'object', properties, required: parts.flatMap((part) => part.required ?? []) };
    };

    const typeOf = (node) => {
      const ref = named(node);
      if (ref) {
        const name = componentName(ref);
        schemas.add(name);
        return `\`${name}\``;
      }
      const schema = resolve(node);
      // Some list responses give `items` as an array of alternatives.
      if (schema.items) return `array of ${[schema.items].flat().map(typeOf).join(' | ')}`;
      const variants = schema.oneOf ?? schema.anyOf;
      if (variants) return `one of ${variants.map(typeOf).join(' | ')}`;
      const type = schema.type ?? (schema.properties || schema.allOf ? 'object' : 'any');
      return schema.format ? `${type} (${schema.format})` : type;
    };

    const notes = (schema) =>
      [
        cleanDescription(schema.description),
        schema.enum && `One of: ${schema.enum.map((value) => `\`${value}\``).join(', ')}.`,
        schema.default !== undefined && `Default: \`${JSON.stringify(schema.default)}\`.`,
        schema.example !== undefined &&
          typeof schema.example !== 'object' &&
          `Example: \`${JSON.stringify(schema.example)}\`.`,
      ]
        .filter(Boolean)
        .join(' ');

    const children = (node, depth) => {
      if (named(node)) return [];
      const schema = resolve(node);
      if (schema.items) return [schema.items].flat().flatMap((item) => children(item, depth));
      const variants = schema.oneOf ?? schema.anyOf;
      if (variants) {
        return variants.flatMap((variant, index) =>
          named(variant) || !merged(variant).properties
            ? []
            : [`${'  '.repeat(depth)}- Option ${index + 1}:`, ...fields(variant, depth + 1)],
        );
      }
      return fields(node, depth);
    };

    const fields = (node, depth) => {
      const schema = merged(node);
      const required = new Set(schema.required ?? []);
      return Object.entries(schema.properties ?? {}).flatMap(([name, property]) => {
        const resolved = resolve(property);
        const traits = [
          typeOf(property),
          required.has(name) && 'required',
          resolved.nullable && 'nullable',
          resolved.readOnly && 'read-only',
          resolved.deprecated && 'deprecated',
        ].filter(Boolean);
        const text = notes({ ...resolved, description: property.description ?? resolved.description });
        return [
          `${'  '.repeat(depth)}- \`${name}\` (${traits.join(', ')})${
            text ? `: ${text.replace(/\n/g, `\n${'  '.repeat(depth + 1)}`)}` : ''
          }`,
          ...children(property, depth + 1),
        ];
      });
    };

    const schemaBlock = (node) => {
      if (named(node)) return [`Schema: ${typeOf(node)}`];
      const list = children(node, 0);
      return list.length ? list : [`Schema: ${typeOf(node)}`];
    };

    const content = (media = {}) =>
      Object.entries(media).flatMap(([type, { schema, example, examples }]) => {
        const sample = example ?? Object.values(examples ?? {})[0]?.value;
        return [
          `Content type: \`${type}\``,
          '',
          ...(schema ? [...schemaBlock(schema), ''] : []),
          ...(sample === undefined ? [] : ['```json', JSON.stringify(sample, null, 2), '```', '']),
        ];
      });

    const parameters = (list) => {
      const params = list.map(resolve);
      if (!params.length) return [];
      return [
        '### Parameters',
        '',
        '| Name | In | Type | Required | Description |',
        '| --- | --- | --- | --- | --- |',
        ...params.map(
          (param) =>
            `| \`${param.name}\` | ${param.in} | ${cell(typeOf(param.schema ?? {}))} | ${
              param.required ? 'yes' : 'no'
            } | ${cell(notes({ ...resolve(param.schema), description: param.description }))} |`,
        ),
        '',
      ];
    };

    const operation = ({ method, path, operation: op, shared, webhook, tag }) => {
      const title = op.summary ?? op.operationId ?? `${method.toUpperCase()} ${path}`;
      const lines = [`## ${title}`, ''];
      if (webhook) {
        lines.push(`Webhook event \`${webhook}\`: JustiFi sends \`${method.toUpperCase()}\` to your webhook URL.`);
      } else {
        lines.push(`\`${method.toUpperCase()} ${server}${path}\``);
        if (op.operationId) {
          lines.push('', `Reference: ${referenceUrl}#${redocTagAnchor(tag)}/operation/${op.operationId}`);
        }
      }
      if (op.deprecated) lines.push('', '**Deprecated.**');
      lines.push('');
      if (op.description) lines.push(cleanDescription(op.description), '');
      lines.push(...parameters([...(shared ?? []), ...(op.parameters ?? [])]));
      if (op.requestBody) {
        const body = resolve(op.requestBody);
        lines.push('### Request body', '');
        if (body.description) lines.push(cleanDescription(body.description), '');
        lines.push(...content(body.content));
      }
      const responses = Object.entries(op.responses ?? {});
      if (responses.length) {
        lines.push('### Responses', '');
        for (const [status, raw] of responses) {
          const response = resolve(raw);
          lines.push(`#### ${status}${response.description ? `: ${oneLine(response.description)}` : ''}`, '');
          lines.push(...content(response.content));
        }
      }
      return lines;
    };

    const lines = render({ operation });
    if (schemas.size) {
      lines.push('## Schemas', '');
      // A Set visits entries added during iteration, so schemas referenced only from
      // other schemas get listed too.
      for (const name of schemas) {
        const schema = resolve({ $ref: `#/components/schemas/${name}` });
        lines.push(`### ${name}`, '');
        if (schema.description) lines.push(cleanDescription(schema.description), '');
        const list = children({ ...schema, description: undefined }, 0);
        lines.push(...(list.length ? list : [`Type: ${typeOf(schema)}`]), '');
      }
    }
    return `${lines.join('\n').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim()}\n`;
  };

  const entries = new Map();
  const add = (tag, entry) => entries.set(tag, [...(entries.get(tag) ?? []), { ...entry, tag }]);
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const method of METHODS) {
      const op = item[method];
      if (op) for (const tag of op.tags ?? []) add(tag, { method, path, operation: op, shared: item.parameters });
    }
  }
  for (const [name, item] of Object.entries(spec['x-webhooks'] ?? {})) {
    for (const method of METHODS) {
      const op = item[method];
      if (op) for (const tag of op.tags ?? []) add(tag, { method, path: name, operation: op, webhook: name });
    }
  }

  const declared = new Map((spec.tags ?? []).map((tag) => [tag.name, tag]));

  const renderTag = (name) => {
    const tag = declared.get(name) ?? { name };
    const ops = entries.get(name) ?? [];
    const title = tag['x-displayName'] ?? name;
    const markdown = renderPage(({ operation }) => [
      `# ${title}`,
      '',
      `Reference: ${referenceUrl}#${redocTagAnchor(name)}`,
      '',
      ...(tag.description ? [cleanDescription(tag.description), ''] : []),
      ...ops.flatMap((entry) => ['', ...operation(entry)]),
    ]);
    const summaries = ops.map(({ operation: op, webhook }) => op.summary ?? webhook ?? op.operationId);
    const note = summaries.length
      ? summaries.join(', ')
      : oneLine(cleanDescription(tag.description).replace(/^#+ .*$/gm, '')).split(/(?<=\.)\s/)[0];
    return { title, slug: slugify(name), note, markdown };
  };

  // Redoc only shows tags that belong to a group, so tags outside every group stay out.
  const groups = (spec['x-tagGroups'] ?? []).map((group) => ({
    name: group.name,
    pages: group.tags.map(renderTag),
  }));

  const introduction = `${[
    `# ${spec.info?.title ?? 'API'} reference`,
    '',
    `Reference: ${referenceUrl}`,
    '',
    `Base URL: \`${server}\``,
    '',
    cleanDescription(spec.info?.description),
  ].join('\n')}\n`;

  return { introduction, groups };
}
