



const config={
    dburl:process.env.DB_URL,
    accessSec:process.env.ACCESS_SEC,
    accessExp:process.env.ACCESS_EXP,
    refreshSec:process.env.REFRESH_SEC,
    refreshExp:process.env.REFRESH_EXP,
    options:{httpOnly:true,
            secure:true
    },
   nodeMailerEmail:process.env.Email,
   nodeMailerPassword:process.env.Email_Password
}

module.exports =config