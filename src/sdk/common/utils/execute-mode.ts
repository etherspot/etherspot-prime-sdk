import { hexConcat } from "ethers/lib/utils";
import { CALL_TYPE, EXEC_TYPE } from "../constants";
import { ethers } from "ethers";

export const getExecuteMode = ({
    callType,
    execType
}: {
    callType: CALL_TYPE
    execType: EXEC_TYPE
}): string => {
    return hexConcat([
        callType, // 1 byte
        execType, // 1 byte
        "0x00000000", // 4 bytes
        "0x00000000", // 4 bytes
        ethers.utils.zeroPad("0x00000000", 22)
    ]);
}
