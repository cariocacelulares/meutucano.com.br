<?php

return [
    'backup' => [
        'name' => 'meutucano',
        'source' => [
            'files' => [
                'include' => [],
                'exclude' => []
            ],

            'databases' => [
                'mysql',
            ],
        ],

        'destination' => [
            'filename_prefix' => '',

            'disks' => [
                'backups',
            ],
        ],
    ],

    'notifications' => [
        'notifications' => [
            \Spatie\Backup\Notifications\Notifications\BackupHasFailed::class         => [],
            \Spatie\Backup\Notifications\Notifications\UnhealthyBackupWasFound::class => [],
            \Spatie\Backup\Notifications\Notifications\CleanupHasFailed::class        => [],
            \Spatie\Backup\Notifications\Notifications\BackupWasSuccessful::class     => [],
            \Spatie\Backup\Notifications\Notifications\HealthyBackupWasFound::class   => [],
            \Spatie\Backup\Notifications\Notifications\CleanupWasSuccessful::class    => [],
        ],
        'notifiable' => \Spatie\Backup\Notifications\Notifiable::class,
        'mail' => [
            'to' => 'your@email.com',
        ],
        'slack' => [
            'webhook_url' => '',
        ],
    ],

    'cleanup' => [
        'strategy' => \Spatie\Backup\Tasks\Cleanup\Strategies\DefaultStrategy::class,
        'defaultStrategy' => [
            'keepAllBackupsForDays'                         => 7,
            'keepDailyBackupsForDays'                       => 16,
            'keepWeeklyBackupsForWeeks'                     => 8,
            'keepMonthlyBackupsForMonths'                   => 6,
            'keepYearlyBackupsForYears'                     => 1,
            'deleteOldestBackupsWhenUsingMoreMegabytesThan' => 5000,
        ],
    ],
];
