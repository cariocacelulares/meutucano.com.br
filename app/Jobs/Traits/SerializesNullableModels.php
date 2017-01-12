<?php namespace App\Jobs\Traits;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Database\ModelIdentifier;
use Illuminate\Database\Eloquent\ModelNotFoundException;

trait SerializesNullableModels
{
    use SerializesModels {
        SerializesModels::getRestoredPropertyValue as parentGetRestoredPropertyValue;
    }

    protected function getRestoredPropertyValue($value)
    {
        try {
            return $this->parentGetRestoredPropertyValue($value);
        } catch (ModelNotFoundException $exception) {
            return null;
        }
    }
}
