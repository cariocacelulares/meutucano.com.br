<?php

return [

    /*
     * The notification that will be sent when a job fails.
     */
    'notification' => \Spatie\FailedJobMonitor\Notification::class,

    /*
     * The notifiable to which the notification will be sent. The default
     * notifiable will use the mail and slack configuration specified
     * in this config file.
     */
    'notifiable' => \Spatie\FailedJobMonitor\Notifiable::class,

    /*
     * By default notifications are sent for all failures. You can pass a callable to filter
     * out certain notifications. The given callable will receive the notification. If the callable
     * return false, the notification will not be sent.
     */
    'notificationFilter' => null,

    /*
     * The channels to which the notification will be sent.
     */
    'channels' => ['mail', 'slack'],

    'mail' => [
        'to' => env('REPORT_EMAIL', 'dev@cariocacelulares.com.br'),
    ],

    'slack' => [
        'webhook_url' => env(
            'FAILED_JOB_SLACK_WEBHOOK_URL',
            'https://hooks.slack.com/services/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'
        ),
    ],
];
