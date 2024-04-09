module marketplace::ext {
    use sui::kiosk_extension::{Self as kiosk_extension};
    use sui::tx_context::{TxContext};
    use sui::object::{ID};
    use sui::kiosk::{Kiosk, KioskOwnerCap};
    use sui::transfer_policy::{TransferPolicy};
    use sui::coin::{Coin};
    use sui::sui::SUI;

    struct Ext has drop{}

    public fun add_marketplace_to_kiosk(kiosk: &mut Kiosk, cap: &KioskOwnerCap, permission: u128, ctx: &mut TxContext) {
        kiosk_extension::add(Ext{}, kiosk, cap, permission, ctx);
    }

    public fun place_item_in_marketplace<T: key + store>(kiosk: &mut Kiosk, item: T, _policy: &TransferPolicy<T>){
        kiosk_extension::place(Ext{}, kiosk, item, _policy);
    }

    public fun lock_item_in_marketplace<T: key + store>(kiosk: &mut Kiosk, item: T, _policy: &TransferPolicy<T>){
        kiosk_extension::lock(Ext{}, kiosk, item, _policy);
    }
    public fun getter_ext(): Ext {
        Ext{}
    }
}