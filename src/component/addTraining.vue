<template>
    <div id="addTraining">
        <el-col :span="24" style="height: 100%; width: 100%;">
            <!-- 头部 -->
            <div class="addTraining_top">
                <span>
                    新增培训
                </span>
            </div>
            <div class="addTraining_form_wrap">
                <div class="addTraining_form_body sx_basis_scroll sx_scroll_style">
                    <el-form 
                        ref="form" 
                        :model="form" 
                        :rules="rules" 
                        label-width="100px" 
                        class="addTraining_form"
                        label-position="left">
                        <el-form-item label="培训标题:" prop="training_title">
                            <el-tooltip class="item" effect="dark" content="标题唯一,不允许重复" placement="left">
                                <el-input v-model="form.training_title" placeholder="请输入培训标题" style="width: 217px;">
                                </el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="培训分类:" required>
                            <el-select v-model="form.training_classify" placeholder="请选择培训分类">
                                <el-option v-for="item in form.training_classify_list" :label="item.classify_name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="培训缩略图:" required>
                            <el-tooltip class="item" effect="dark" placement="left">
                                <div slot="content">
                                    图片大小不能超过1MB
                                    </br>
                                    图片比例4:3为最佳尺寸
                                </div>
                                <el-upload class="avatar-uploader" :action="uploadAddTrainingInfo" name="image_url"
                                :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                    <img v-if="form.thumb_image_url" :src="form.thumb_image_url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon">
                                    </i>
                                </el-upload>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="培训类型:" required>
                            <el-radio class="radio" v-model="training_type" label="1">
                                图文
                            </el-radio>
                            <el-radio class="radio" v-model="training_type" label="2">
                                视频
                            </el-radio>
                        </el-form-item>
                        <template v-if="training_type  >> 0 === 1">
                            <el-form-item label="图文详情:" id="myQuill" required>
                                <el-tooltip class="item" effect="dark" placement="left">
                                    <div slot="content">
                                        图文详情每张图片大小不能超过1MB
                                        </br>
                                        文字不许超过1000字
                                        </br>
                                        图片将以等宽不等高的方式展示在使用端
                                    </div>
                                    <quill-editor v-if="training_type  >> 0 === 1" ref="myTextEditor" v-model="form.newDescription"
                                    :options="editorOption" @showImageUI="imageHandler">
                                    </quill-editor>
                                </el-tooltip>
                            </el-form-item>
                            <input type="file" name="file" id="fileinput" @change="customimgupload($event)"
                            style="display: none;">
                        </template>
                        <template v-else>
                            <el-form-item label="视频地址:" required>
                                <el-input v-model="form.video_url" placeholder="请输入视频地址">
                                </el-input>
                            </el-form-item>
                        </template>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('form')">
                                立即创建
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-col>
    </div>
</template>

<style lang="less">
    #addTraining{
        width: 100%;
        height: 100%;
        
        background: #fff;

        overflow: hidden;
        .addTraining_top{
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;

            height: 50px;
            
            padding: 0 30px;

            border-bottom: 1px solid #E5E9F2;

            line-height: 50px;
            font-size: 18px;
            color: #8492A6;
            .OI{
                color: #1D8CE0;
                font-size: 12px;
            }
        }
        .addTraining_form_wrap{
            box-sizing: border-box;

            width: 100%;
            height: 100%;
            
            padding-bottom: 50px;
            .addTraining_form_body{
                width: 100%;
                height: 100%;
                .addTraining_form{
                    box-sizing: border-box;
                    padding: 30px;

                    label{
                        color: #8492A6;
                    }
                    .el-tag{
                        margin-right: 15px!important;
                    }
                }
            }
        }
    }
</style>

<script>
import * as API from '../assets/axios/api.js'
export default{
    name: 'addTraining',
    data () {
        return {
            uploadAddTrainingInfo: API.uploadAddTrainingInfo, // 文件上传
            training_type: '1', // 培训类型
            form: {
                training_title: '', // 培训标题:
                training_classify: '', // 培训分类:
                training_classify_list: [], // 服务端获取分类
                thumb_image_url: '', // 培训缩略图:
                newDescription: '', // 图文详情
                video_url: ''  // 视频地址
            },
            editorOption: {}, // 富文本对象
            rules: { // 验证
                training_title: [
                { required: true, message: '请输入培训标题', trigger: 'blur' },
                { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        training_type: function (val) {
            if (document.getElementById('myQuill')) {
                var aEle = document.getElementById('myQuill').getElementsByTagName('*')
                for (let i = 0; i < aEle.length; i++) {
                    /* 当className相等时添加到数组中 */
                    if (aEle[i].className == 'ql-toolbar ql-snow') {
                        aEle[i]
                        var _parentElement = aEle[i].parentNode
                        if (_parentElement) {
                            _parentElement.removeChild(aEle[i])
                        }
                    }
                }
            }
        }
    },
    created () {
        this.getTrainingClassifyList() // 获取分类
    },

    methods: {
        /* ------------------ 自定义富文本图片上传 ------------------- */
        imageHandler () {
            const fileinput = document.getElementById('fileinput')
            fileinput.click()
        },
        customimgupload () {
            var formData = new FormData()
            formData.append('image', fileinput.files[0])
            if (fileinput.files[0]) {
                API.myAjax({
                    url: API.editorServer,
                    data: formData,
                    success: msg => {
                        var imageUrl = msg
                        var range = this.$refs.myTextEditor.quillEditor.getSelection()
                        var length = range.index
                        this.$refs.myTextEditor.quillEditor.insertEmbed(length, 'image', imageUrl)
                    },
                    fail: error => {
                        console.log(error)
                    }
                })
            }
        },
        /* --------------------------------------------------------- */
        // 获取分类
        getTrainingClassifyList () {
            this.$axios.post(API.getTrainingClassifyList)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.form.training_classify_list = data.training_classify_list
                    break
                case 9001:
                    this.$message({
                        message: '暂无培训分类!请先添加!',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.push({ path: 'trainingClassifyList' })
                    }, 2000)
                    break
                default:
                    this.$message.error('获取分类失败,请重试!')
                    break
                }
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        },

        // 图片上传成功后
        handleAvatarSuccess (res, file) {
            switch (res.flag) {
            case 1000:
                this.form.thumb_image_url = res.file_url
                this.$message({
                    message: '缩略图上传成功',
                    type: 'success'
                })
                break
            default:
                this.$message.error('服务器异常')
                break
            }
        },

        // 图片上传前
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png'
            const isLt1M = file.size / 1024 / 1024 < 1

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
            }
            if (!isLt1M) {
                this.$message.error('上传头像图片大小不能超过 1MB!')
            }
            return isJPG && isLt1M
        },

        // 检验数据
        onSubmit (formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                if (!this.form.training_classify) {
                    this.$message({
                        message: '请选择培训分类',
                        type: 'warning'
                    })
                    return false
                }
                if (!this.form.thumb_image_url) {
                    this.$message({
                        message: '请上传培训缩略图',
                        type: 'warning'
                    })
                    return false
                }
                let Data = null // 传输数据格式
                switch (this.training_type) {
                case '1':
                    if (!this.form.newDescription) {
                        this.$message({
                            message: '请完善图文详情',
                            type: 'warning'
                        })
                        return false
                    }
                    Data = {
                        'training_title': this.form.training_title,
                        'training_classify': this.form.training_classify,
                        'training_type': this.training_type,
                        'thumb_image_url': this.form.thumb_image_url,
                        'training_value': this.form.newDescription
                    }
                    this.postData(Data)
                    break
                case '2':
                    if (!this.form.video_url) {
                        this.$message({
                            message: '请输入视频地址',
                            type: 'warning'
                        })
                        return false
                    }
                    Data = {
                        'training_title': this.form.training_title,
                        'training_classify': this.form.training_classify,
                        'training_type': this.training_type,
                        'thumb_image_url': this.form.thumb_image_url,
                        'training_value': this.form.video_url
                    }
                    this.postData(Data)
                    break
                }
            })
        },

        // 提交数据
        postData (Data) {
            this.$axios.post(API.addTrainingInfo, Data)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.$message({
                        message: '培训内容添加成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.push({ path: 'trainingList' })
                    }, 2000)
                    break
                default:
                    this.$message.error(data.return_code)
                    break
                }
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        }
    }
}
</script>
