/// A Policy that makes sure an item is placed into the `Kiosk` after `purchase`.
/// `Kiosk` can be any.
module marketplace::item_locked_policy {
    use sui::kiosk::{Self, Kiosk};
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicy,
        TransferPolicyCap,
        TransferRequest
    };
    use sui::coin::{Self, Coin};
    use sui::tx_context::{Self, TxContext};
    use sui::sui::SUI;
    use sui::object::ID;

    //  Amount for royalty
    const MAX_BP: u128 = 10_000;

    // Rule configuration
    struct Config has store, drop { royalty_amount: u16 }

    /// Item is not in the `Kiosk`.
    const ENotInKiosk: u64 = 0;

    const ENotInKioskBucket: u64 = 199;

    /// Insufficent amount for royalty
    const EInsufficientAmount: u64 = 0;

    /// A unique confirmation for the Rule
    struct Rule has drop {}

     /// A unique confirmation for the Rule
    struct RoyaltyRule has drop {}

    public fun set<T>(policy: &mut TransferPolicy<T>, cap: &TransferPolicyCap<T>) {
        policy::add_rule(Rule {}, policy, cap, true)
    }

    public fun add_royalty_rule<T>(policy: &mut TransferPolicy<T>, cap: &TransferPolicyCap<T>, royalty_amount: u16) {
        policy::add_rule(RoyaltyRule {}, policy, cap,  Config { royalty_amount });
    }

    /// Prove that an item a
    public fun prove<T>(request: &mut TransferRequest<T>, kiosk: &Kiosk) {
        let item = policy::item(request);
        assert!(kiosk::has_item(kiosk, item) && kiosk::is_locked(kiosk, item), ENotInKiosk);
        policy::add_receipt(Rule {}, request)
    }

    // Prove royalty rule
    public fun verify_royalty<T>(
        policy: &mut TransferPolicy<T>,
        request: &mut TransferRequest<T>,
        payment: &mut Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // using the getter to read the paid amount
        let paid = policy::paid(request);
        let config: &Config = policy::get_rule(Rule {}, policy);
        let amount = (((paid as u128) * (config.royalty_amount as u128) / MAX_BP) as u64);
        assert!(coin::value(payment) >= amount, EInsufficientAmount);

        let fee = coin::split(payment, amount, ctx);
        policy::add_to_balance(Rule {}, policy, fee);
        policy::add_receipt(Rule {}, request)
    }
}