export function verifyUsername(val) {
    //用户名格式：4-16位（中文、字母，数字，下划线，减号）
    let errorTip = '';
    if(!val) {
        errorTip = '请输入用户名';
        return {
            result: false,
            errorTip
        }
    }
    let bool = /^[(a-zA-Z0-9\u4e00-\u9fa5){1}_-]{4,16}$/.test(val);
    errorTip = bool ? '' : '用户名格式不正确';
    return {
        result: bool,
        errorTip
    }
} 

export function verifyPassword(val) {
    //校验密码：只能输入6-20个字母、数字、下划线
    let errorTip = '';
    if(!val) {
        errorTip = '请输入密码';
        return {
            result: false,
            errorTip
        }
    }
    let bool = /^(\w){6,20}$/.test(val);
    errorTip = bool ? '' : '密码格式不正确';
    return {
        result: bool,
        errorTip
    }
}

export function verifyRePassword(reVal, val) {
    //校验密码：只能输入6-20个字母、数字、下划线
    let errorTip = '';
    if(!reVal) {
        errorTip = '请输入确认密码';
        return {
            result: false,
            errorTip
        }
    }
    if(reVal != val) {
        errorTip = '两次密码输入不一致';
        return {
            result: false,
            errorTip
        }
    }
    return {
        result: true,
        errorTip
    };
}

export function verifyEmail(val) {
    let errorTip = '';
    if(!val) {
        errorTip = '请输入邮箱';
        return {
            result: false,
            errorTip
        }
    }
    let bool = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(val);
    errorTip = bool ? '' : '邮箱格式不正确';
    return {
        result: bool,
        errorTip
    }
}