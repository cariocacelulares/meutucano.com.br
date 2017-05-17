<?php namespace App\Interfaces;

interface ShipmentApiInterface
{
    public function refreshStatus();
    public function calculateDeadline();
    public function history();
    public function printLabel();
    public function generateTrackingCode();
}
