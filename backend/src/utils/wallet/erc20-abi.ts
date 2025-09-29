export default [
    {
        "type": "impl",
        "name": "ERC20Impl",
        "interface_name": "openzeppelin::token::erc20::interface::IERC20"
    },
    {
        "type": "interface",
        "name": "openzeppelin::token::erc20::interface::IERC20",
        "items": [
            {
                "type": "function",
                "name": "name",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::felt252"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "symbol",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::felt252"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "decimals",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u8"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "total_supply",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "balance_of",
                "inputs": [
                    {
                        "name": "account",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "allowance",
                "inputs": [
                    {
                        "name": "owner",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "spender",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "transfer",
                "inputs": [
                    {
                        "name": "recipient",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "amount",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "transfer_from",
                "inputs": [
                    {
                        "name": "sender",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "recipient",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "amount",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "approve",
                "inputs": [
                    {
                        "name": "spender",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "amount",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "external"
            }
        ]
    },
    {
        "type": "interface",
        "name": "openzeppelin::token::erc20::interface::IERC20CamelOnly",
        "items": [
            {
                "type": "function",
                "name": "totalSupply",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "balanceOf",
                "inputs": [
                    {
                        "name": "account",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "transferFrom",
                "inputs": [
                    {
                        "name": "sender",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "recipient",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "amount",
                        "type": "core::integer::u256"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::bool"
                    }
                ],
                "state_mutability": "external"
            }
        ]
    },
    {
        "type": "function",
        "name": "increase_allowance",
        "inputs": [
            {
                "name": "spender",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "added_value",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "decrease_allowance",
        "inputs": [
            {
                "name": "spender",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "subtracted_value",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "increaseAllowance",
        "inputs": [
            {
                "name": "spender",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "addedValue",
                "type": "core::integer::u256"
            }
        ],
        "outputs": [
            {
                "type": "core::bool"
            }
        ],
        "state_mutability": "external"
    },
]