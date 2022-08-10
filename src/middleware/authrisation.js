const authorization = function(...roles){
    return (req , res , next) => {
        const isallowed = roles.find((role) => req.user.role === role) ;
        console.log(roles) ;
        if(!isallowed) {
            res.send({
                "message": "not allowed to access to resource" ,
            })
            return ;
        }
        next() ;
    }
}


module.exports = authorization