<?php namespace Bootstrap;

use \DateTime;
use \DateTimeZone;
use \Monolog\Formatter\FormatterInterface;

class MongoFormatter implements FormatterInterface
{
    private $_zone;
    private $_format;

    function __construct($zone = null, $format = DateTime::W3C)
    {
        $this->_zone   = ($zone === null) ? new DateTimeZone('UTC') : new DateTimeZone($zone);
        $this->_format = $format;
    }

    /**
     * {@inheritdoc}
     */
    public function format(array $record)
    {
        $fields = [
            'message'  => (isset($record['message'])) ? $record['message'] : null,
            'level'    => (isset($record['level_name'])) ? $record['level_name'] : null,
            'channel'  => (isset($record['channel'])) ? $record['channel'] : null,
            'datetime' => (isset($record['datetime'])) ? $record['datetime'] : null,
            'datetimeStamp' => null,
        ];

        if ($fields['datetime']) {
            $fields['datetime']->setTimezone($this->_zone);
            $fields['datetimeStamp'] = $fields['datetime']->getTimestamp();
            $fields['datetime']      = $fields['datetime']->format($this->_format);
        }

        return array_merge($fields, ((isset($record['extra'])) ? $record['extra'] : []));
    }

    /**
     * {@inheritdoc}
     */
    public function formatBatch(array $records)
    {
        $formatted = [];

        foreach ($records as $record) {
            $formatted[] = $this->format($record);
        }

        return $formatted;
    }
}