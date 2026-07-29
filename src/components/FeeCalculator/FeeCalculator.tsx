import React, { useState, useMemo } from "react";

type FeeConfig = {
  enabled: boolean;
  variableRate: number; // percentage (2.75 = 2.75%)
  transactionFeeCents: number;
  feeCapCents: number | null;
};

type FeeConfigKey =
  | "processing_ecomm"
  | "processing_card_present"
  | "processing_ach"
  | "processing_ach_expedited"
  | "platform"
  | "visa_brand_ecomm"
  | "visa_brand_card_present"
  | "mastercard_brand_ecomm"
  | "mastercard_brand_card_present"
  | "amex_brand_ecomm"
  | "amex_brand_card_present"
  | "discover_brand_ecomm"
  | "discover_brand_card_present";

type PaymentScenario = {
  label: string;
  brand: string | null;
  type: "ecomm" | "card_present" | "ach" | "ach_expedited";
};

const SCENARIOS: PaymentScenario[] = [
  { label: "Visa online", brand: "visa", type: "ecomm" },
  { label: "Visa terminal", brand: "visa", type: "card_present" },
  { label: "Mastercard online", brand: "mastercard", type: "ecomm" },
  { label: "Mastercard terminal", brand: "mastercard", type: "card_present" },
  { label: "Amex online", brand: "amex", type: "ecomm" },
  { label: "Amex terminal", brand: "amex", type: "card_present" },
  { label: "Discover online", brand: "discover", type: "ecomm" },
  { label: "Discover terminal", brand: "discover", type: "card_present" },
  { label: "ACH", brand: null, type: "ach" },
  { label: "Expedited ACH", brand: null, type: "ach_expedited" },
];

const BASE_CONFIGS: { key: FeeConfigKey; label: string }[] = [
  { key: "processing_ecomm", label: "Online payments (processing_ecomm)" },
  {
    key: "processing_card_present",
    label: "Terminal payments (processing_card_present)",
  },
  { key: "processing_ach", label: "ACH payments (processing_ach)" },
  {
    key: "processing_ach_expedited",
    label: "Expedited ACH payments (processing_ach_expedited)",
  },
];

const BRAND_CONFIGS: { key: FeeConfigKey; label: string }[] = [
  { key: "visa_brand_ecomm", label: "Visa online (visa_brand_ecomm)" },
  {
    key: "visa_brand_card_present",
    label: "Visa terminal (visa_brand_card_present)",
  },
  {
    key: "mastercard_brand_ecomm",
    label: "Mastercard online (mastercard_brand_ecomm)",
  },
  {
    key: "mastercard_brand_card_present",
    label: "Mastercard terminal (mastercard_brand_card_present)",
  },
  { key: "amex_brand_ecomm", label: "Amex online (amex_brand_ecomm)" },
  {
    key: "amex_brand_card_present",
    label: "Amex terminal (amex_brand_card_present)",
  },
  {
    key: "discover_brand_ecomm",
    label: "Discover online (discover_brand_ecomm)",
  },
  {
    key: "discover_brand_card_present",
    label: "Discover terminal (discover_brand_card_present)",
  },
];

const DEFAULT_CONFIGS: Record<FeeConfigKey, FeeConfig> = {
  processing_ecomm: {
    enabled: true,
    variableRate: 2.75,
    transactionFeeCents: 25,
    feeCapCents: null,
  },
  processing_card_present: {
    enabled: true,
    variableRate: 2.50,
    transactionFeeCents: 10,
    feeCapCents: null,
  },
  processing_ach: {
    enabled: false,
    variableRate: 0.80,
    transactionFeeCents: 0,
    feeCapCents: 500,
  },
  processing_ach_expedited: {
    enabled: false,
    variableRate: 1.50,
    transactionFeeCents: 0,
    feeCapCents: null,
  },
  platform: {
    enabled: true,
    variableRate: 1.00,
    transactionFeeCents: 0,
    feeCapCents: null,
  },
  visa_brand_ecomm: {
    enabled: false,
    variableRate: 2.60,
    transactionFeeCents: 25,
    feeCapCents: null,
  },
  visa_brand_card_present: {
    enabled: false,
    variableRate: 2.40,
    transactionFeeCents: 10,
    feeCapCents: null,
  },
  mastercard_brand_ecomm: {
    enabled: false,
    variableRate: 2.70,
    transactionFeeCents: 25,
    feeCapCents: null,
  },
  mastercard_brand_card_present: {
    enabled: false,
    variableRate: 2.45,
    transactionFeeCents: 10,
    feeCapCents: null,
  },
  amex_brand_ecomm: {
    enabled: true,
    variableRate: 3.25,
    transactionFeeCents: 25,
    feeCapCents: null,
  },
  amex_brand_card_present: {
    enabled: false,
    variableRate: 3.00,
    transactionFeeCents: 10,
    feeCapCents: null,
  },
  discover_brand_ecomm: {
    enabled: false,
    variableRate: 2.80,
    transactionFeeCents: 25,
    feeCapCents: null,
  },
  discover_brand_card_present: {
    enabled: false,
    variableRate: 2.55,
    transactionFeeCents: 10,
    feeCapCents: null,
  },
};

function calculateFee(
  amountCents: number,
  config: FeeConfig
): { feeCents: number } {
  // variable_rate is a percentage (2.75 = 2.75%), convert to decimal multiplier
  let fee =
    Math.round(amountCents * (config.variableRate / 100)) +
    config.transactionFeeCents;
  if (config.feeCapCents !== null) {
    fee = Math.min(fee, config.feeCapCents);
  }
  return { feeCents: fee };
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function resolveProcessingConfig(
  scenario: PaymentScenario,
  configs: Record<FeeConfigKey, FeeConfig>
): { key: FeeConfigKey; config: FeeConfig; isBrandSpecific: boolean } | null {
  // Try brand-specific first
  if (scenario.brand) {
    const brandKey =
      `${scenario.brand}_brand_${scenario.type}` as FeeConfigKey;
    if (configs[brandKey]?.enabled) {
      return { key: brandKey, config: configs[brandKey], isBrandSpecific: true };
    }
  }

  // Fall back to base processing
  const baseKey = scenario.type === "ach"
    ? "processing_ach"
    : scenario.type === "ach_expedited"
      ? "processing_ach_expedited"
      : scenario.type === "card_present"
        ? "processing_card_present"
        : "processing_ecomm";
  const baseKeyTyped = baseKey as FeeConfigKey;

  if (configs[baseKeyTyped]?.enabled) {
    return {
      key: baseKeyTyped,
      config: configs[baseKeyTyped],
      isBrandSpecific: false,
    };
  }

  return null;
}

const styles = {
  container: {
    border: "1px solid var(--jf-border-default)",
    borderRadius: "var(--jf-radius-lg)",
    padding: "var(--jf-space-xl)",
    marginBottom: "var(--jf-space-xl)",
    backgroundColor: "var(--jf-surface-default)",
    boxShadow: "var(--jf-shadow-sm)",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "var(--jf-font-size-lg)",
    fontWeight: "var(--jf-font-weight-semibold)" as unknown as number,
    marginBottom: "var(--jf-space-md)",
    color: "var(--jf-text-primary)",
  } as React.CSSProperties,
  configGroup: {
    marginBottom: "var(--jf-space-xl)",
  } as React.CSSProperties,
  configRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--jf-space-md)",
    padding: "var(--jf-space-sm) var(--jf-space-md)",
    borderRadius: "var(--jf-radius-sm)",
    marginBottom: "var(--jf-space-xs)",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  configRowEnabled: {
    backgroundColor: "var(--jf-surface-raised)",
  } as React.CSSProperties,
  checkbox: {
    cursor: "pointer",
    width: "18px",
    height: "18px",
    accentColor: "var(--jf-accent-600)",
  } as React.CSSProperties,
  configLabel: {
    flex: "1 1 200px",
    fontSize: "var(--jf-font-size-base)",
    fontFamily: "var(--jf-font-mono)",
  } as React.CSSProperties,
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "var(--jf-font-size-sm)",
  } as React.CSSProperties,
  input: {
    width: "70px",
    padding: "4px var(--jf-space-sm)",
    border: "1px solid var(--jf-border-default)",
    borderRadius: "var(--jf-radius-sm)",
    fontSize: "var(--jf-font-size-sm)",
    backgroundColor: "var(--jf-surface-canvas)",
    color: "var(--jf-text-primary)",
  } as React.CSSProperties,
  inputDisabled: {
    opacity: 0.4,
  } as React.CSSProperties,
  paymentInput: {
    display: "flex",
    alignItems: "center",
    gap: "var(--jf-space-md)",
    marginBottom: "20px",
    fontSize: "var(--jf-font-size-md)",
  } as React.CSSProperties,
  paymentAmountInput: {
    width: "120px",
    padding: "var(--jf-space-sm) var(--jf-space-md)",
    border: "1px solid var(--jf-border-default)",
    borderRadius: "var(--jf-radius-sm)",
    fontSize: "var(--jf-font-size-md)",
    backgroundColor: "var(--jf-surface-canvas)",
    color: "var(--jf-text-primary)",
  } as React.CSSProperties,
  resultsTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "var(--jf-font-size-base)",
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "var(--jf-space-md) var(--jf-space-lg)",
    borderBottom: "1px solid var(--jf-border-default)",
    fontSize: "var(--jf-font-size-sm)",
    fontWeight: "var(--jf-font-weight-semibold)" as unknown as number,
    textTransform: "uppercase" as const,
    letterSpacing: "var(--jf-tracking-label)",
    color: "var(--jf-text-secondary)",
  } as React.CSSProperties,
  td: {
    padding: "var(--jf-space-md) var(--jf-space-lg)",
    borderBottom: "1px solid var(--jf-border-default)",
    color: "var(--jf-text-primary)",
  } as React.CSSProperties,
  configUsed: {
    fontFamily: "var(--jf-font-mono)",
    fontSize: "var(--jf-font-size-sm)",
    padding: "2px 6px",
    borderRadius: "var(--jf-radius-sm)",
    backgroundColor: "var(--jf-surface-raised)",
    color: "var(--jf-text-secondary)",
  } as React.CSSProperties,
  brandBadge: {
    fontSize: "10px",
    padding: "2px var(--jf-space-sm)",
    borderRadius: "var(--jf-radius-full)",
    backgroundColor: "rgba(255, 160, 0, 0.1)",
    border: "1px solid rgba(255, 160, 0, 0.3)",
    color: "var(--jf-accent-text)",
    marginLeft: "6px",
  } as React.CSSProperties,
  fallbackBadge: {
    fontSize: "10px",
    padding: "2px var(--jf-space-sm)",
    borderRadius: "var(--jf-radius-full)",
    backgroundColor: "var(--jf-surface-raised)",
    border: "1px solid var(--jf-border-default)",
    color: "var(--jf-text-secondary)",
    marginLeft: "6px",
  } as React.CSSProperties,
  noConfig: {
    color: "var(--jf-danger)",
    fontStyle: "italic",
  } as React.CSSProperties,
  totalFee: {
    fontWeight: 600,
  } as React.CSSProperties,
  divider: {
    border: "none",
    borderTop: "1px solid var(--jf-border-default)",
    margin: "var(--jf-space-xl) 0",
  } as React.CSSProperties,
};

function NumericInput({
  value,
  onCommit,
  disabled,
  defaultOnBlur,
  style: inputStyle,
  ...rest
}: {
  value: number | null;
  onCommit: (value: number | null) => void;
  disabled?: boolean;
  defaultOnBlur?: number | null;
  style?: React.CSSProperties;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur" | "style" | "type">) {
  const [raw, setRaw] = useState<string | null>(null);
  const isEditing = raw !== null;
  const displayValue = isEditing ? raw : (value === null ? "" : String(value));

  return (
    <input
      type="number"
      value={displayValue}
      onChange={(e) => setRaw(e.target.value)}
      onFocus={() => setRaw(value === null ? "" : String(value))}
      onBlur={() => {
        const trimmed = raw?.trim() ?? "";
        if (trimmed === "") {
          onCommit(defaultOnBlur ?? null);
        } else {
          const num = Number(trimmed);
          onCommit(isNaN(num) ? (defaultOnBlur ?? null) : num);
        }
        setRaw(null);
      }}
      disabled={disabled}
      style={inputStyle}
      {...rest}
    />
  );
}

function ConfigInput({
  label,
  configKey,
  config,
  onChange,
  alwaysEnabled,
}: {
  label: string;
  configKey: FeeConfigKey;
  config: FeeConfig;
  onChange: (key: FeeConfigKey, config: FeeConfig) => void;
  alwaysEnabled?: boolean;
}) {
  const disabled = !config.enabled;

  return (
    <div
      style={{
        ...styles.configRow,
        ...(config.enabled ? styles.configRowEnabled : {}),
      }}
    >
      <input
        type="checkbox"
        checked={config.enabled}
        disabled={alwaysEnabled}
        onChange={(e) =>
          onChange(configKey, { ...config, enabled: e.target.checked })
        }
        style={styles.checkbox}
      />
      <span
        style={{
          ...styles.configLabel,
          ...(disabled ? { opacity: 0.4 } : {}),
        }}
      >
        {label}
      </span>
      <span style={styles.inputGroup}>
        <label>Rate:</label>
        <NumericInput
          value={config.variableRate}
          onCommit={(v) =>
            onChange(configKey, { ...config, variableRate: v ?? 0 })
          }
          defaultOnBlur={0}
          disabled={disabled}
          style={{ ...styles.input, ...(disabled ? styles.inputDisabled : {}) }}
          min={0}
          step={0.01}
        />
        <span style={disabled ? { opacity: 0.4 } : {}}>%</span>
      </span>
      <span style={styles.inputGroup}>
        <label>+ Flat:</label>
        <NumericInput
          value={config.transactionFeeCents}
          onCommit={(v) =>
            onChange(configKey, { ...config, transactionFeeCents: v ?? 0 })
          }
          defaultOnBlur={0}
          disabled={disabled}
          style={{ ...styles.input, ...(disabled ? styles.inputDisabled : {}) }}
          min={0}
        />
        <span style={disabled ? { opacity: 0.4 } : {}}>cents</span>
      </span>
      <span style={styles.inputGroup}>
        <label>Cap:</label>
        <NumericInput
          value={config.feeCapCents}
          onCommit={(v) =>
            onChange(configKey, { ...config, feeCapCents: v })
          }
          defaultOnBlur={null}
          disabled={disabled}
          style={{ ...styles.input, ...(disabled ? styles.inputDisabled : {}) }}
          min={0}
          placeholder="none"
        />
        <span style={disabled ? { opacity: 0.4 } : {}}>cents</span>
      </span>
    </div>
  );
}

export default function FeeCalculator() {
  const [configs, setConfigs] =
    useState<Record<FeeConfigKey, FeeConfig>>(DEFAULT_CONFIGS);
  const [paymentAmountDollars, setPaymentAmountDollars] = useState(100);

  const paymentAmountCents = Math.round(paymentAmountDollars * 100);

  const handleConfigChange = (key: FeeConfigKey, config: FeeConfig) => {
    setConfigs((prev) => ({ ...prev, [key]: config }));
  };

  const results = useMemo(() => {
    return SCENARIOS.map((scenario) => {
      const processing = resolveProcessingConfig(scenario, configs);
      const platform = configs.platform.enabled ? configs.platform : null;

      let processingFee = 0;
      let platformFee = 0;

      if (processing) {
        processingFee = calculateFee(
          paymentAmountCents,
          processing.config
        ).feeCents;
      }
      if (platform) {
        platformFee = calculateFee(paymentAmountCents, platform).feeCents;
      }

      return {
        scenario,
        processing,
        platformFee,
        processingFee,
        totalFee: processingFee + platformFee,
      };
    }).filter((r) => {
      // Only show scenarios where the base config is enabled
      if (r.scenario.type === "ecomm")
        return configs.processing_ecomm.enabled;
      if (r.scenario.type === "card_present")
        return configs.processing_card_present.enabled;
      if (r.scenario.type === "ach") return configs.processing_ach.enabled;
      if (r.scenario.type === "ach_expedited") return configs.processing_ach_expedited.enabled;
      return true;
    });
  }, [configs, paymentAmountCents]);

  return (
    <div style={styles.container}>
      <div style={styles.configGroup}>
        <div style={styles.sectionTitle}>Base Processing Fees</div>
        {BASE_CONFIGS.map(({ key, label }) => (
          <ConfigInput
            key={key}
            label={label}
            configKey={key}
            config={configs[key]}
            onChange={handleConfigChange}
          />
        ))}
      </div>

      <div style={styles.configGroup}>
        <div style={styles.sectionTitle}>Brand-Specific Fees (optional)</div>
        {BRAND_CONFIGS.map(({ key, label }) => (
          <ConfigInput
            key={key}
            label={label}
            configKey={key}
            config={configs[key]}
            onChange={handleConfigChange}
          />
        ))}
      </div>

      <div style={styles.configGroup}>
        <div style={styles.sectionTitle}>Platform Fee (optional)</div>
        <ConfigInput
          label="Platform fee (platform)"
          configKey="platform"
          config={configs.platform}
          onChange={handleConfigChange}
        />
      </div>

      <hr style={styles.divider} />

      <div style={styles.sectionTitle}>Payment Simulation</div>
      <div style={styles.paymentInput}>
        <label>Payment amount:</label>
        <span>$</span>
        <NumericInput
          value={paymentAmountDollars}
          onCommit={(v) => setPaymentAmountDollars(v ?? 0)}
          defaultOnBlur={0}
          style={styles.paymentAmountInput}
          min={0.01}
          step={0.01}
        />
      </div>

      <table style={styles.resultsTable}>
        <thead>
          <tr>
            <th style={styles.th}>Payment Type</th>
            <th style={styles.th}>Config Used</th>
            <th style={styles.th}>Processing Fee</th>
            <th style={styles.th}>Platform Fee</th>
            <th style={styles.th}>Total Fee</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.scenario.label}>
              <td style={styles.td}>{r.scenario.label}</td>
              <td style={styles.td}>
                {r.processing ? (
                  <>
                    <span style={styles.configUsed}>{r.processing.key}</span>
                    {r.processing.isBrandSpecific ? (
                      <span style={styles.brandBadge}>brand</span>
                    ) : (
                      <span style={styles.fallbackBadge}>base</span>
                    )}
                  </>
                ) : (
                  <span style={styles.noConfig}>no config</span>
                )}
              </td>
              <td style={styles.td}>
                {r.processing ? formatCents(r.processingFee) : "—"}
              </td>
              <td style={styles.td}>
                {r.platformFee > 0 ? formatCents(r.platformFee) : "—"}
              </td>
              <td style={{ ...styles.td, ...styles.totalFee }}>
                {r.processing ? formatCents(r.totalFee) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
