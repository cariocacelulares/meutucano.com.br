<?php namespace App\Models\Traits;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;

trait UploadableTrait
{
    public static function bootUploadableTrait()
    {
        if (!defined('self::UPLOAD_PATH') || !defined('self::UPLOAD_ATTR'))
            throw new \Exception("Upload path and attr are required on uploadable models.");

        static::creating(function($parent) {
            foreach (self::UPLOAD_ATTR as $attr) {
                $file = Input::file($attr);

                if (!$file) continue;

                $fileName = str_slug(date('Ymd His')) . '.' .  $file->getClientOriginalExtension();

                if (!$file->move(storage_path('app/public/' . self::UPLOAD_PATH), $fileName)) {
                    throw new \Exception("Não foi possível realizar upload do arquivo");
                }

                $parent->$attr = $fileName;
            }
        });

        static::deleting(function($parent) {
            if (isset($parent->forceDeleting) && !$parent->forceDeleting) return;

            foreach (self::UPLOAD_ATTR as $attr) {
                $file = storage_path('app/public/' . self::UPLOAD_PATH) . '/' . $parent->attributes[$attr];

                if (File::exists($file) && !File::delete($file)) {
                    throw new \Exception("Não foi possível apagar o arquivo");
                }
            }
        });
    }
}
