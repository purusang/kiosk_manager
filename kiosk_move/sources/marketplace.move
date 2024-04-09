module marketplace::nft {

    // Part 1: Imports
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::package;
    use sui::display;
    use std::string::{Self as string, utf8, String};

    struct NFT has drop {

    }

    // Part 2: Struct definitions
    struct Sword has key, store {
        id: UID,
        name: String,
        description: String,
        url: String,
        strength: u64,
    }

    // Part 3: Module initializer to be executed when this module is published
    fun init(witness:NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"), 
            utf8(b"description"),
            utf8(b"url"),
        ];
        let values = vector[
            utf8(b"{name}"),
            utf8(b"{description}"),
            utf8(b"{url}"),
        ];
        let publisher = package::claim(witness, ctx);
        let display = display::new_with_fields<Sword>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }
    public entry fun mint(ctx: &mut TxContext){
        let nft = Sword{
            id: object::new(ctx),
            name: string::utf8(b"Kiosk NFT"),
            description: string::utf8(b"Selling Rare NFT"),
            url: string::utf8(b"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8hBB6Rgo9TgL5Xq0O2qfCLXgJkALu90m3usJ9Qd7pqYX88oMH"),
            strength: 50,
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }
}