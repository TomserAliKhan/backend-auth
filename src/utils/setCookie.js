

exports.setAccessToken=(res,accessToken)=>{
    res.cookie('accessToken', accessToken,
       {
        httpOnly:true,
        secure:true,
        maxAge:60*1000
       }
    );
}

exports.setRefreshToken=(res,refreshToken)=>{
    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        secure:true,
        maxAge:7*24*60*60*1000
    });
}
