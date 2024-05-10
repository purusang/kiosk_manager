module marketplace::move_test {

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    struct Num has key, store {
        id: UID,
        n: u256
    }


    fun init(ctx: &mut TxContext){
        let obj_num = Num{
            id: object::new(ctx),
            n : 0
        };

        transfer::transfer(obj_num, tx_context::sender(ctx));
    }

    public entry fun increase(num: &mut Num){
        let c_num = num.n;
        num.n = c_num + 1;
    }

    public entry fun get_value(num: &Num):u256{
        num.n
    }


}