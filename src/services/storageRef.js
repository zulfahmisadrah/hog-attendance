import {storage} from "./firebase";
import {STORAGE_AVATAR} from "../utils/Constants";

export const storageRef = storage.ref()
export const avatarRef = storageRef.child(STORAGE_AVATAR)