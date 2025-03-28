
let ajaxTimes = 0;
export const request=(params)=>{
    ajaxTimes++;

    wx.showLoading({
        title: 'loading',
        mask:true
    })
    const baseUrl = "http://127.0.0.1:5000/api/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            
            url:baseUrl+params.url,
            data:params.data,
            method: params.method,
            Headers:params.header,
            dataType:"json",
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                    wx.hideLoading(); 
                }
            }
        });
    })
}