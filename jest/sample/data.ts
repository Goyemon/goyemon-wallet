export const tx = {
    normalOutgoing: { hash: "3c81aa72528097507e1c6b01074ea6750faecbfe9e6d311ba5120b864836bb06",nonce: 662,timestamp: 1596008734,gasPrice: "0f5de81400",gas: "5208",value: "470de4df820000",to_addr: ["9e37c8e84a516afd31dac366b2c8d47df283b001"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: {  },data: 1 },
    normalIncoming: { hash: "c9100386bd6d548a10d23fca7da94e1fa77c18fd7b64ff47b04ef16b4796a418",nonce: 311,timestamp: 1596008610,gasPrice: "1010b87200",gas: "5208",value: "2386f26fc10000",to_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],from_addr: ["9e37c8e84a516afd31dac366b2c8d47df283b001"],state: 3,tokenData: {  },data: 1 },
    normalSelf: { hash: "33c1c5bfefc39a036cb6b0ce0ee1d2397c34c68bb494105a99200a1a30f65642",nonce: 637,timestamp: 1595951108,gasPrice: "11b1f3f800",gas: "5208",value: "2386f26fc10000",to_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: {  },data: 1 },
    daiOutgoing: { hash: "9d97a4a1f76aee00474e574580756552d433abae7dd0e05d988dc6debcfb70cb",nonce: 609,timestamp: 1595490785,gasPrice: "104c533c00",gas: "8fde",value: "00",to_addr: ["b5e5d0f8c0cba267cd3d7035d6adc8eba7df7cdd"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: { dai: [{ from_addr: "a7d41f49dadca972958487391d4461a5d0e1c3e9",to_addr: "0c41d57db49e8415f2550c8325264577230b562f",amount: "0de0b6b3a7640000" }] },data: 1 },
    cdaiOutgoing: { hash: "835d99577535cf29d544c667f5a46095fe8763aff289f4cb8a41ed2f60b46821",nonce: 657,timestamp: 1596008367,gasPrice: "0ee6b28000",gas: "0110af",value: "00",to_addr: ["2b536482a01e620ee111747f8334b395a42a555e"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: { cdai: [{ from_addr: "a7d41f49dadca972958487391d4461a5d0e1c3e9",to_addr: "9e37c8e84a516afd31dac366b2c8d47df283b001",amount: "3b9aca00" }] },data: 1 },
    compoundWithdraw: { hash: "1795568bb44f854dec0aca6ca587b2ea5873cf971d1a61ceb4de4f7c1179cfd2",nonce: 659,timestamp: 1596008492,gasPrice: "0f5de81400",gas: "01f600",value: "00",to_addr: ["2b536482a01e620ee111747f8334b395a42a555e"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: { cdai: [{ redeemer: "a7d41f49dadca972958487391d4461a5d0e1c3e9",redeemUnderlying: "3782dace9d900000",redeemAmount: "02f6117981" }] },data: 1 },
    compoundDeposit: { hash: "46df59e3660dc91de6c3b5eb7aec9068806057ce3bf225ff326bcd6a6d527253",nonce: 666,timestamp: 1596782826,gasPrice: "0dbcac8e00",gas: "0219b2",value: "00",to_addr: ["2b536482a01e620ee111747f8334b395a42a555e"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: { cdai: [{ minter: "a7d41f49dadca972958487391d4461a5d0e1c3e9",mintUnderlying: "3782dace9d900000",mintAmount: "02f60f093a" }] },data: 1 },
    uniswap: { hash: "a608014af09fed856cc0c1de9d77c96a762bd5e06760325dbf4f994e7abdf246",nonce: 661,timestamp: 1596008535,gasPrice: "0f5de81400",gas: "01ad8b",value: "2386f26fc10000",to_addr: ["7a250d5630b4cf539739df2c5dacb4c659f2488d"],from_addr: ["a7d41f49dadca972958487391d4461a5d0e1c3e9"],state: 3,tokenData: { uniswap2ethdai: [{ sender: "7a250d5630b4cf539739df2c5dacb4c659f2488d",amount0In: "00",eth_sold: "2386f26fc10000",tok_bought: "020154160817b1",amount1Out: "00",from_addr: "a7d41f49dadca972958487391d4461a5d0e1c3e9" }] },data: 1 },
}

export const data = {
    normalOutgoing: [{ type: "transfer",direction: "outgoing",amount: "0.0200",token: "eth" }],
    normalIncoming: [{ type: "transfer",direction: "incoming",amount: "0.0100",token: "eth" }],
    normalSelf: [{ type: "transfer",direction: "self",amount: "0.0100",token: "eth" }],
    daiOutgoing: [{ type: "transfer",amount: "1.00",direction: "outgoing",token: "dai" }],
    cdaiOutgoing: [{ type: "transfer",amount: "0.00",direction: "outgoing",token: "cdai" }],
    compoundWithdraw: [{ type: "withdraw",amount: "4.00",token: "cdai" }],
    compoundDeposit: [{ type: "deposit",amount: "4.00",token: "cdai" }],
    uniswap: [{ type: "swap",eth_sold: "0.1000",tokens_bought: "0.00",token: "uniswap2ethdai" }],
}
