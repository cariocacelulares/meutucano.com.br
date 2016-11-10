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
        $this->_zone = ($zone === null) ? new DateTimeZone('UTC') : new DateTimeZone($zone);
        $this->_format = $format;
    }


    /**
     * {@inheritdoc}
     */
    public function format(array $record)
    {
        $message = null;
        if (isset($record['message'])) {
            $message = $record['message'];
        }

        // field 'array context' is skipped

        // field 'int level' is skipped

        $levelName = null;
        if (isset($record['level_name'])) {
            $levelName = $record['level_name'];
        }

        $channel = null;
        if (isset($record['channel'])) {
            $channel = $record['channel'];
        }

        $dateTime = null;
        $dateTimeStamp = null;
        if (isset($record['datetime'])) {
            $dateTime = $record['datetime'];
            $dateTime->setTimezone($this->_zone);
            $dateTimeStamp = $dateTime->getTimestamp();
            $dateTime = $dateTime->format($this->_format);
        }

        $extra = null;
        if (isset($record['extra'])) {
            // extra will be an array
            $extra = $record['extra'];
        }

        return array_merge(
            [
                'datetime'      => $dateTime,
                'datetimeStamp' => $dateTimeStamp,
                'channel'       => $channel,
                'level'         => $levelName,
                'message'       => $message
            ],
            $extra
        );
    }

    /**
     * {@inheritdoc}
     */
    public function formatBatch(array $records)
    {
        $formatted = array();

        foreach ($records as $record) {
            $formatted[] = $this->format($record);
        }

        return $formatted;
    }
}