var mongoose = require('mongoose');

// 스키마
var postSchema = mongoose.Schema(
  {
    title:{type:String, required:true},
    body:{type:String},
    createdAt:{type:Date, default:Date.now},
    updateAD:{type:Date},
  }
  ,{
    toObject:{virtuals:true}
  });

// virtuals
// 글작성 날짜
postSchema.virtual("createdDate").get(function()
{
  return getDate(this.createdAt);
})
// 글작성 시간
postSchema.virtual("createdTime").get(function()
{
  return getTime(this.createdAt);
});

// 글 수정 날짜
postSchema.virtual("updatedDate").get(function()
{
  return getDate(this.updatedAt);
});


// 글 수정 시간
postSchema.virtual("updatedTime").get(function()
{
  return getTime(this.updatedAt);
});


// 모델 & export
// db collections 에 접근하는 방법
var Post = mongoose.model("post", postSchema);
module.exports = Post;

// 함수
// 날짜
function getDate(dateObj)
{
  if(dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1) + "-" + get2digits(dateObj.getDate());
}

function getTime(dateObj)
{
  if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
}

function get2digits(num)
{
  return("0" + num).slice(-2);
}
