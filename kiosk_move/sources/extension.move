module marketplace::demo_ext{
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::package;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};

    /// The dynamic field key for the Kiosk Name Extension
    struct KioskName has store, drop {}

    struct DEMO_EXT has drop {}

    struct DemoStruct has key, store{
        id: UID,
        name: String,
        value: u64
    }

    // Part 3: Module initializer to be executed when this module is published
    // fun init( witness:DEMO_EXT, value: u64, transfer_to: address, ctx: &mut TxContext) {
    //     let demo_obj = DemoStruct{
    //         id: object::new(ctx),
    //         name: string::utf8(b"Hello World!"),
    //         value: value
    //     };
    //     transfer::public_transfer(demo_obj,transfer_to);
    //     let publisher = package::claim(witness, ctx);
    //     transfer::public_transfer(publisher, tx_context::sender(ctx));

    //     // // Transfer the forge object to the module/package publisher
    //     // transfer::transfer(admin, tx_context::sender(ctx));
    // }

    // Add a name to the Kiosk (in this implementation can be called only once)
    // public fun add(self: &mut Kiosk, cap: &KioskOwnerCap, name: String) {
    //     let uid_mut = kiosk::uid_mut_as_owner(self, cap);
    //     df::add(uid_mut, KioskName {}, name)
    // }

    // Try read the name of the Kiosk - if set - return Some(String), if not - None
    // public fun name(self: &Kiosk): Option<String> {
    //     if (df::exists_(kiosk::uid(self), KioskName {}) {
    //         option::some(*df::borrow(kiosk::uid(self), KioskName {}))
    //     } else {
    //         option::none()
    //     }
    // }
}