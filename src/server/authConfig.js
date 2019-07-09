

const authConfig= () =>  
     ({
        shragaURL: process.env.SHRAGA_URL || "http://localhost:3000", 
        callbackURL: process.env.CALLBACK_URL || "http://localhost:1337/auth/shraga"
    });


export default authConfig;
