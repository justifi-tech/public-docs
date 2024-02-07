Integrate your app with Amazon EventBridge (https://aws.amazon.com/eventbridge) to manage large volumes of
event notifications and receive JustiFi events using an event bus.

EventBridge lets you process events at the rate that works for your tech stack without getting
overwhelmed. It is highly scalable and resilient, and lets you accept more webhook traffic while
reducing your infrastructure cost and complexity.

**When you're ready to get started:**

- Go to EventBridge in your AWS Console
- Create an Event Bus to allow events from another account
- Add the specified policy as a resource-policy to the event bus
```
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "allow_justifi_account_to_put_events",
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::<justifi-account-id>:root"
    },
    "Action": "events:PutEvents",
    "Resource": "arn:aws:events:<aws-region>:<aws-account-id>:event-bus/<aws-event-bus-name>"
  }]
}
```

*Contact JustiFi to get our AWS account id*


EventBridge allows events to be sent to multiple targets.
The following example will send those events to a Cloudwatch Log Group

- Go to CloudWatch in your AWS Console
- Create a Log Group


Back on EventBridge:
- Create an Event Rule to receive JustiFi Events inside previously created event bus
- Add the following event pattern 
```
{
  "source": ["justifi.events"]
}
```
- Add CloudWatch Log Group as a target
- You can either type the log group name or select it in the list

In the Developer Tools section of the JustiFi app:
- Add an event publisher with EventBridge delivery method and enter the ARN for your event bus (you’ll also choose which event types will publish). We recommend starting with a test account.
- Test the publisher by prompting one of the event types you chose and making sure you receive the published event
