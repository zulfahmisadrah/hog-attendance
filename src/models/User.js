import {convertNullToUndefined, convertUndefinedToNull} from "../utils/Commons";

export default class User {
    constructor(user) {
        this.name = user.name
        this.email = user.email
        this.role = user.role
        this.phoneNumber = user.phoneNumber
        this.photo = user.photo
        this.school = user.school
        this.program = user.program
        this.category = user.category
        this.interest = user.interest
        this.emailVerified = user.emailVerified
        this.emailVerifiedAt = user.emailVerifiedAt
        this.createdAt = user.createdAt
        this.updatedAt = user.updatedAt
    }
}

export const userConverter = {
    toFirestore: function (user) {
        convertUndefinedToNull(user)
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            photo: user.photo,
            school: user.school,
            program: user.program,
            category: user.category,
            interest: user.interest,
            emailVerified: user.emailVerified,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        convertNullToUndefined(data)
        return new User(data)
    }
}