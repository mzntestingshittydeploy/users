const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:          { type: String, required: true, unique: true},
    password:       { type: String, required: true},
    displayName:    { type: String, required: true},
    userRole:       { type: String, required: true}
}, { timestamps: true });

userSchema.pre('save', 
    async function(next) {
        const user = this;
        if (!user.isModified('password')) return next();
        
        //const salt = process.env.BCRYPT_SALT ? process.env.BCRYPT_SALT : 10;
        let hash = bcrypt.hashSync(this.password, 10);
        this.password = hash;

        next();
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;