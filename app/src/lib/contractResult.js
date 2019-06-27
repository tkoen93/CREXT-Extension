const convert = require('./convert');

function contractResult(res) {

  let returnmessage;

    if (res.smart_contract_result.v_array !== null) {
        returnmessage = res.smart_contract_result.v_array;
    }
    if (res.smart_contract_result.v_boolean !== null) {
        returnmessage = res.smart_contract_result.v_boolean;
    }
    if (res.smart_contract_result.v_boolean_box !== null) {
        returnmessage = res.smart_contract_result.v_boolean_box;
    }
    if (res.smart_contract_result.v_byte !== null) {
        returnmessage = res.smart_contract_result.v_byte;
    }
    if (res.smart_contract_result.v_byte_box !== null) {
        returnmessage = res.smart_contract_result.v_byte_box;
    }
    if (res.smart_contract_result.v_double !== null) {
        returnmessage = res.smart_contract_result.v_double;
    }
    if (res.smart_contract_result.v_double_box !== null) {
        returnmessage = res.smart_contract_result.v_double_box;
    }
    if (res.smart_contract_result.v_float !== null) {
        returnmessage = res.smart_contract_result.v_float;
    }
    if (res.smart_contract_result.v_float_box !== null) {
        returnmessage = res.smart_contract_result.v_float_box;
    }
    if (res.smart_contract_result.v_int !== null) {
        returnmessage = res.smart_contract_result.v_int;
    }
    if (res.smart_contract_result.v_int_box !== null) {
        returnmessage = res.smart_contract_result.v_int_box;
    }
    if (res.smart_contract_result.v_list !== null) {
        returnmessage = res.smart_contract_result.v_list;
    }
    if (res.smart_contract_result.v_long !== null) {
        returnmessage = convert(res.smart_contract_result.v_long.buffer);
    }
    if (res.smart_contract_result.v_long_box !== null) {
        returnmessage = res.smart_contract_result.v_int_long;
    }
    if (res.smart_contract_result.v_map !== null) {
        returnmessage = res.smart_contract_result.v_map;
    }
    if (res.smart_contract_result.v_null !== null) {
        returnmessage = res.smart_contract_result.v_null;
    }
    if (res.smart_contract_result.v_object !== null) {
        returnmessage = res.smart_contract_result.v_object;
    }
    if (res.smart_contract_result.v_set !== null) {
        returnmessage = res.smart_contract_result.v_set;
    }
    if (res.smart_contract_result.v_short !== null) {
        returnmessage = res.smart_contract_result.v_short;
    }
    if (res.smart_contract_result.v_short_box !== null) {
        returnmessage = res.smart_contract_result.v_short_box;
    }
    if (res.smart_contract_result.v_string !== null) {
        returnmessage = res.smart_contract_result.v_string;
    }
    if (res.smart_contract_result.v_void !== null) {
        returnmessage = res.smart_contract_result.v_void;
    }

    return returnmessage;

}

module.exports = contractResult;
