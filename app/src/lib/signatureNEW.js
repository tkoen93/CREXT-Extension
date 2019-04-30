var API_TYPES = require("../gen-nodejs/api_types");
var GEN_TYPES = require("../gen-nodejs/general_types");
var nacl = require('tweetnacl');
var bs58 = require('bs58');

module.exports = ConstructTransaction;

async function ConstructTransaction(ApiConnect, Obj, Transac) {

    if (typeof Obj.source === "string") {
        try {
            Obj.source = bs58.decode(Obj.source);
        } catch (e) {
            return { result: "error", message: "Source is not correct" };
        }
    }

    if (typeof Obj.Priv === "string") {
        try {
            Obj.Priv = bs58.decode(Obj.Priv);
        } catch (e) {
            return { result: "error", message: "Priv is not correct" };
        }
    }

    if (typeof Obj.amount === "string") {
        Obj.amount = Obj.amount.replace(/,/, '.');
    }
    if (isNaN(Number(Obj.amount))) {
        return { result: "error", message: "Amount is not correct" };
    }

    if (typeof Obj.fee === "string") {
        Obj.fee = Obj.fee.replace(/,/, '.');
    }
    if (isNaN(Number(Obj.fee))) {
        return { result: "error", message: "Fee is not correct" };
    }

    if (Obj.smart !== undefined && Obj.smart.code !== undefined) {
        var TestCode = ApiConnect.SmartContractCompile(Obj.smart.code);
        if (TestCode.status.code > 0) {
            alert(TestCode.status.message);
            return null;
        }

    }

    var Trans;
    if (Transac === undefined) {
        Trans = new API_TYPES.Transaction();
    } else {
        Trans = Transac;
    }

    var TransId = await ApiConnect.WalletTransactionsCountGet(Obj.source);
      if (TransId.status.message === "Success") {
          Trans.id = TransId.lastTransactionInnerId + 1;
      } else {
          Trans.id = 0;
      }



    var PerSign = new Uint8Array();

    var InnerId = NumbToByte(Trans.id, 6);

//    var SourseId = await ApiConnect.WalletIdGet(Obj.source);
//      if (SourseId.walletId > 0) {
//          Trans.source = GetBitArray(SourseId.walletId, 4);
//          InnerId[5] += 128;
//      } else {
          Trans.source = Obj.source;
//      }


    if (Obj.smart !== undefined && Obj.smart.code !== undefined) {
        var SmartInnerId = NumbToByte(Trans.id, 6);

        let BytesC = concatTypedArrays(Obj.source, SmartInnerId);


        let ByteCodeList = ApiConnect.SmartContractCompile(Obj.smart.code);

        console.log(ByteCodeList);

        for (var index in ByteCodeList.byteCodeObjects) {
            let ByteCodeS = ByteCodeList.byteCodeObjects[index].byteCode;
            let BytesNC = new Uint8Array(ByteCodeS.length);
            for (i in ByteCodeS) {
                BytesNC[Number(i)] = ByteCodeS[i].charCodeAt();
            }
            BytesC = concatTypedArrays(BytesC, BytesNC);
        }

        Trans.target = blake2s(BytesC);
    } else {
        if (typeof Obj.target === "string") {
            try {
                Obj.target = bs58.decode(Obj.target);
            } catch (e) {
                return { result: "error", message: "Target is not correct" };
            }
        }

  //  var TargetId = await ApiConnect.WalletIdGet(Obj.target);
        //  if (TargetId.walletId > 0) {
        //      Trans.target = GetBitArray(TargetId.walletId, 4);
        //      console.log(TargetId.walletId);
        //      console.log(Trans.target);
        //      InnerId[5] += 64;
        //  } else {
              Trans.target = Obj.target;
              console.log(Trans.target);
        //  }


    }

  //  let F = ((Number(Obj.amount) * 10 - Math.trunc(Obj.amount) * 10) / 10) * Math.pow(10, 18);

  let F;

  deci = Obj.amount.toString().split(".");
  if(deci.length > 1) {
    ftest = deci[1].split("");

    for(i = ftest.length; i<18; i++) {
      ftest[i] = 0;
    }

    finalFraction = ftest.join("");

    F = parseInt(finalFraction, 10);
  } else {
    F = 0;
  }

    Trans.amount = new API_TYPES.Amount({
        integral: Math.trunc(Obj.amount),
        fraction: F
    });

    Trans.balance = new API_TYPES.Amount({ integral: 0, fraction: 0 });
    Trans.currency = 1;
    Trans.timeCreation = new Date().valueOf();

  /*  F = Fee(Number(Obj.fee));

    let FeeBits = "0";
    let FeeIntegral = NumbToBits(F.exp);
    if (FeeIntegral.length < 5) {
        while (FeeIntegral.length < 5) {
            FeeIntegral = "0" + FeeIntegral;
        }
    }
    let FeeFraction = NumbToBits(F.man);
    if (FeeFraction.length < 10) {
        while (FeeFraction.length < 10) {
            FeeFraction = "0" + FeeFraction;
        }
    }
    FeeBits += FeeIntegral + FeeFraction;

    Trans.fee = new API_TYPES.AmountCommission({ commission: BitsToNumb(FeeBits) });*/

    let Fee = Fee(Obj.fee);
    let FE = NumbToBits(Fee.exp);
    while (FE.length < 5){
        FE = "0" + FE;
    }
    let FM = NumbToBits(Fee.man);
    while (FM.length < 10) {
        FM = "0" + FM;
    }

    Trans.fee = new AmountCommission({
        commission: BitsToNumb("0" + FE + FM)
    });

    PerSign = concatTypedArrays(PerSign, InnerId);
    PerSign = concatTypedArrays(PerSign, Trans.source);
    PerSign = concatTypedArrays(PerSign, Trans.target);
    PerSign = concatTypedArrays(PerSign, GetBitArray(Trans.amount.integral, 4));

    InnerId = NumbToByte(Trans.amount.fraction, 8);

    PerSign = concatTypedArrays(PerSign, InnerId);
    //PerSign = concatTypedArrays(PerSign, BitsToByts(FeeBits).reverse());
    PerSign = concatTypedArrays(PerSign, NumbToByte(Trans.fee.commission), 2);
    PerSign = concatTypedArrays(PerSign, new Uint8Array([1]));

    if (Obj.smart === undefined) {
        PerSign = concatTypedArrays(PerSign, new Uint8Array(1));
    }
    else {
        PerSign = concatTypedArrays(PerSign, new Uint8Array([1]));

        let UserField = new Uint8Array();

        Trans.smartContract = new SmartContractInvocation();

        UserField = concatTypedArrays(UserField, new Uint8Array([11, 0, 1]));
        if (Obj.smart.method === undefined) {
            UserField = concatTypedArrays(UserField, new Uint8Array(4));
        }
        else {
            Trans.smartContract.method = Obj.smart.method;
            UserField = concatTypedArrays(UserField, NumbToByte(Obj.smart.method.length, 4).reverse());
            UserField = concatTypedArrays(UserField, ConvertCharToByte(Obj.smart.method));
        }

        UserField = concatTypedArrays(UserField, new Uint8Array([15, 0, 2, 12]));
        if (Obj.smart.params === undefined) {
            UserField = concatTypedArrays(UserField, new Uint8Array(4));
        }
        else {
            Trans.smartContract.params = [];
            UserField = concatTypedArrays(UserField, NumbToByte(Obj.smart.params.length, 4).reverse());
            for (let i in Obj.smart.params) {
                let val = Obj.smart.params[i];

                switch (val.key)
                {
                    case "STRING":
                        UserField = concatTypedArrays(UserField, new Uint8Array([11, 0, 17]));
                        UserField = concatTypedArrays(UserField, NumbToByte(val.value.length, 4).reverse());
                        UserField = concatTypedArrays(UserField, ConvertCharToByte(val.value));
                        Trans.smartContract.params.push(new Variant({ v_string: val.value }));
                        UserField = concatTypedArrays(UserField, new Uint8Array(1));
                    break;
                }
            }
        }

        UserField = concatTypedArrays(UserField, new Uint8Array([15, 0, 3, 11, 0, 0, 0, 0]));

        Trans.smartContract.forgetNewState = Obj.smart.forgetNewState;
        UserField = concatTypedArrays(UserField, new Uint8Array([2, 0, 4, 0]));
        if (Obj.smart.forgetNewState) {
            UserField[UserField.length - 1] = 1;
        }

        if (Obj.smart.code !== undefined) {
            UserField = concatTypedArrays(UserField, new Uint8Array([12, 0, 5, 11, 0, 1]));

            Trans.smartContract.smartContractDeploy = new API_TYPES.SmartContractDeploy({
                sourceCode: Obj.smart.code
            });

            UserField = concatTypedArrays(UserField, NumbToByte(Obj.smart.code.length, 4).reverse());
            UserField = concatTypedArrays(UserField, ConvertCharToByte(Obj.smart.code));

            UserField = concatTypedArrays(UserField, new Uint8Array([15, 0, 2, 12]));
            let ByteCode = Obj._connect.SmartContractCompile(Obj.smart.code);


            if (ByteCode.status.code === 0) {
                Trans.smartContract.smartContractDeploy.byteCodeObjects = [];
                UserField = concatTypedArrays(UserField, NumbToByte(ByteCode.byteCodeObjects.length, 4).reverse());

                for (let i in ByteCode.byteCodeObjects) {


                    let val = ByteCode.byteCodeObjects[i];
                    UserField = concatTypedArrays(UserField, new Uint8Array([11, 0, 1]));
                    UserField = concatTypedArrays(UserField, NumbToByte(val.name.length, 4).reverse());
                    UserField = concatTypedArrays(UserField, ConvertCharToByte(val.name));

                    UserField = concatTypedArrays(UserField, new Uint8Array([11, 0, 2]));
                    UserField = concatTypedArrays(UserField, NumbToByte(val.byteCode.length, 4).reverse());
                    UserField = concatTypedArrays(UserField, ConvertCharToByte(val.byteCode));
                    Trans.smartContract.smartContractDeploy.byteCodeObjects.push(new ByteCodeObject({
                        name: val.name,
                        byteCode: val.byteCode
                    }));
                }

                UserField = concatTypedArrays(UserField, new Uint8Array(1));
            }
            else {
                ResObj.Message = ByteCode.Status.Message;
                return ResObj;
            }

            UserField = concatTypedArrays(UserField, new Uint8Array([11, 0, 3, 0, 0, 0, 0, 8, 0, 4, 0, 0, 0, 0, 0]));
        }

        UserField = concatTypedArrays(UserField, new Uint8Array(1));
        PerSign = concatTypedArrays(PerSign, NumbToByte(UserField.length, 4));
        PerSign = concatTypedArrays(PerSign, UserField);
    }

    console.log(PerSign);
    console.log(PerSign.join(" "));

    var ArHex = "0123456789ABCDEF";
    var Hex = "";
    for (var j = 0; j < PerSign.length; j++) {
        Hex += ArHex[Math.floor(PerSign[j] / 16)];
        Hex += ArHex[Math.floor(PerSign[j] % 16)];
    }
    console.log(Hex);

    Trans.signature = Buffer.from(nacl.sign.detached(PerSign, Obj.Priv));
    return Trans;
}

function ConvertCharToByte(Str) {
    let B = new Uint8Array(Str.length);
    for (let i in Str) {
        B[i] = Str[i].charCodeAt();
    }
    return B;
}

function NumbToBits(int) {
    let Bits = "";

    let numb = String(int);
    while (true) {
        Bits = (numb % 2) + Bits;
        numb = Math.floor(numb / 2);

        if (numb <= 1) {
            Bits = numb + Bits;
            break;
        }
    }

    return Bits;
}

function BitsToByts(Bits) {
    let Lng = 0;
    if (Bits.length % 8 === 0) {
        Lng = Math.floor(Bits.length / 8);
    } else {
        Lng = Math.floor(Bits.length / 8) + 1;
    }

    let Byts = new Uint8Array(Lng);
    let Stage = 1;
    let i = Bits.length - 1;
    while (true) {
        if (Math.floor(((i + 1) % 8)) === 0) {
            Stage = 1;
        }
        Byts[Math.floor(i / 8)] += Stage * Bits[i];
        Stage *= 2;
        if (i === 0) {
            break;
        }
        i -=1;
    }

    return Byts;
}

function BitsToNumb(Bits) {
    let numb = 0;
    let mnoj = 1;
    for (var i = Bits.length-1; i > 0; i -= 1) {
        if (Bits[i] !== 0) {
            numb += mnoj * Bits[i];
        }
        mnoj *= 2;
    }
    return numb;
}

function GetBitArray(n, i) {
    var Ar = new Uint8Array(i);
    for (var index in Ar) {
        Ar[index] = index > 0 ? (n >> index * 8) & 0xFF : n & 0xFF;
    }
    return Ar;
}

function concatTypedArrays(a, b) {
    var c = new (Uint8Array.prototype.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function Fee(v) {
    let s = v > 0 ? 0 : 1;
    v = Math.abs(v);
    exp = v == 0 ? 0 : Math.log10(v);
    exp = Math.floor(exp >= 0 ? exp + 0.5 : exp - 0.5);
    v /= Math.pow(10, exp);
    if (v >= 1) {
        v *= 0.1;
        ++exp;
    }
    v = Number((v * 1024).toFixed(0));
    return { exp: exp + 18, man: v === 1024? 1023: v };
}

function NumbToByte(numb, CountByte) {
    let InnerId = new Uint8Array(CountByte);
    numb = String(numb);
    let i = 1;
    let index = 0;
    while (true) {
        InnerId[index] += (numb % 2) * i;
        numb = Math.floor(numb / 2);
        if (numb === 0) {
            break;
        }
        if (numb === 1) {
            var b = (numb % 2) * i * 2;
            if (b === 256) {
                ++InnerId[index + 1];
            } else {
                InnerId[index] += (numb % 2) * i * 2;
            }
            break;
        }

        if (i === 128) {
            i = 1;
            index++;
        } else {
            i *= 2;
        }
    }
    return InnerId;
}
