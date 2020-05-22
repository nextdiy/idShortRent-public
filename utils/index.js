import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import ClipboardJS from 'clipboard'

dayjs.extend(customParseFormat)

//时间戳转换 时间
/**
 * 
 * @param {*} date 
 */
export function formatTime(date = new Date()){
    return dayjs(new Date(date)).format('YYYY-MM-DD HH:mm:ss'); 
}

//时间戳转换 日期
/**
 * 
 * @param {*} date 
 */
export function formatDate(date = new Date()){
    return dayjs(new Date(date)).format('YYYY-MM-DD'); 
}

/**
 * 
 * @param {Number} s: 金额
 * @param {Number} dot: 小数点后几位
 */
export function formatMoney(s = 0, dot = 2) {
    s = parseFloat(s) / 100; //除100
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + ""; 
    let l = s.split(".")[0].split("").reverse(),   
    r = s.split(".")[1];   
    let t = "";   
    for(let i = 0; i < l.length; i ++ )   {   
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? dot : "");   
    }   
    return t.split("").reverse().join("") + "." + r;
}

//订单状态
const ORDER_STATUS_CODE = {
    1:'待付款',
    2:'租用中',
    3:'已完成',
    4:'已取消',
    5:'退款中',
    6:'已退款',
    7:'拒绝退款',
    10: '充值中',
    11: '充值成功',
    12: '充值失败'
}

//货架状态
const SHELF_STATUS_CODE = {
    0: '空闲',
    1: '待上架',
    2: '待出租',
    3: '出租中',
    4: '密码待更新',
    6: '账号已过期'
}

// const statusCodeAdmin = {
//     1:'待付款',
//     2:'出租中',
//     3:'交易完成',
//     5:'交易取消',
//     6:'退款中',
//     7:'已退款',
//     8:'拒绝退款'
// }

/**
 * 
 * @param {Number} status: 订单状态
 */
export function transOrderStatus(status = 0) {
    status = Number(status) || 0;
    return ORDER_STATUS_CODE[status] || '未知状态';
}

/**
 * 
 * @param {Number} status: 货架状态
 */
export function transShelfStatus(status = 0) {
    status = Number(status) || 0;
    return SHELF_STATUS_CODE[status] || '未知状态';
}

/**
 * 
 * @param {*} e: 触发的$event
 * @param {String} content: 提示内容
 */
export function copyText(e, content) {
    return new Promise((resolve, reject) => {
        var clipboard = new ClipboardJS(e.target, {
            text: () => content
        });
        clipboard.on('success', e => {
            resolve({result: 'success'})
            // 释放内存
            clipboard.off('error')
            clipboard.off('success')
            clipboard.destroy()
        })
        clipboard.on('error', e => {
            console.log(e);
            reject({result: 'error'})
            // 释放内存
            clipboard.off('error')
            clipboard.off('success')
            clipboard.destroy()
        })
        clipboard.onClick(e);
    })
}

/**
 * 
 * @param {Function} fn:需要防抖的函数
 * @param {Number} ms:多少秒内以后触发
 */
export function debounce(fn, ms = 3000) {
    let timer;
    return function() {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, ms)
    }
}

/**
 * 
 * @param {Function} fn:需要节流的函数
 * @param {Number} ms:多少秒内只触发一次
 */
export function throttle(fn, ms = 3000) {
    let lastDate = null;
    return function() {
        let nowDate = new Date().getTime();
        console.log(nowDate, lastDate,nowDate - lastDate)
        if(nowDate - lastDate >= ms) {
            lastDate = new Date().getTime();
            fn.apply(this, arguments)
        }
    }
}
