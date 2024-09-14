export const checkIsAuthorized=()=>{
    let token = window.localStorage.getItem("token")
    if(token){
        return true;
    }else {
        return false;
    }
}