<template>
    <div id="trainingList">
        <el-row style="margin-bottom: 15px;">
            <el-col :span="24">
                <el-form ref="form" :model="form" label-position="left" inline label-width="75px">
                    <el-row type="flex" justify="space-around">

                            <el-form-item label="培训分类:">
                                <el-select v-model="form.training_classify" placeholder="请选择" clearable>
                                    <el-option v-for="item in form.training_classify_list" :label="item.classify_name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="培训类型:">
                                <el-select v-model="form.training_type" placeholder="请选择" clearable>
                                    <el-option label="图文" value="1">
                                    </el-option>
                                    <el-option label="视频" value="2">
                                    </el-option>
                                </el-select>
                            </el-form-item>
 
                            <el-form-item label="关键字:">
                                <el-input v-model="form.keyword" placeholder="请输入关键字">
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="success" @click="searchTraining">
                                    立即搜索
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <router-link to="/addTraining">
                                    <el-button type="info">
                                        新增培训
                                    </el-button>
                                </router-link>
                            </el-form-item>

                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <div class="trainingList_body_wrap">
            <div class="trainingList_body">
                <div class="table_body sx_basis_scroll sx_scroll_style" id="table">
                    <el-table :data="training_list" stripe style="width: 100%">
                        <el-table-column label="缩略图" align="center" width="180">
                            <template scope="scope">
                                <img width="100%" height="auto" class="imgList" v-show="scope.row.thumb_image" :src="scope.row.thumb_image"
                                :alt="scope.row.classify_name">
                            </template>
                        </el-table-column>
                        <el-table-column label="培训标题" align="center" prop="title">
                        </el-table-column>
                        <el-table-column label="培训分类" align="center" prop="classify_name">
                        </el-table-column>
                        <el-table-column label="培训类型" align="center">
                            <template scope="scope">
                                {{ scope.row.type_id == '1' ? '图文' : '视频' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="180">
                            <template scope="scope">
                                <el-row type="flex" justify="space-around">
                                    <template v-if="scope.row.recommend == 1">
                                        <el-button type="text" @click="handleTrainingRecommend(scope.row.id,'0')"
                                        size="mini">
                                            取消推荐
                                        </el-button>
                                    </template>
                                    <template v-else>
                                        <el-button @click="handleTrainingRecommend(scope.row.id,'1')" size="mini">
                                            推荐
                                        </el-button>
                                    </template>
                                    <el-button type="text" icon="edit" @click="getModifyTrainingInfo(scope.row.id)">
                                    </el-button>
                                    <el-button type="text" icon="delete" @click="removeTraining(scope.row.id, scope.$index, training_list)">
                                    </el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination @current-change="handleCurrentChange" :current-page="current_page"
                    :page-size="20" layout="prev, pager, next, jumper" :total="20*total_pages"
                    style="float: right;padding: 0;">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 修改 -->
        <el-dialog title="修改商品" v-model="dialogFormVisible">
            <el-form ref="form" :model="modify_form" label-width="100px" style="width: 100%;"
            label-position="left">
                <el-form-item label="培训标题:" prop="training_title">
                    <el-input v-model="modify_form.training_title" placeholder="请输入培训标题" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="培训分类:">
                    <el-select v-model="modify_form.training_classify" placeholder="请选择培训分类">
                        <el-option v-for="item in form.training_classify_list" :label="item.classify_name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="培训缩略图:">
                    <el-tooltip class="item" effect="dark" placement="left">
                        <div slot="content">
                            图片大小不能超过1MB
                            </br>
                            图片比例4:3为最佳尺寸
                        </div>
                        <el-upload class="avatar-uploader" action="http://a001.aybc.so/Shop/addTrainingInfo"
                        name="image_url" :show-file-list="false" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                            <img v-if="modify_form.thumb_image_url" :src="modify_form.thumb_image_url"
                            class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon">
                            </i>
                        </el-upload>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="培训类型:">
                    <el-radio class="radio" v-model="training_type" label="1" disabled>
                        图文
                    </el-radio>
                    <el-radio class="radio" v-model="training_type" label="2" disabled>
                        视频
                    </el-radio>
                </el-form-item>
                <template v-if="training_type >> 0 === 1">
                    <el-form-item label="图文详情:" id="myQuill">
                        <el-tooltip class="item" effect="dark" placement="left">
                            <div slot="content">
                                图文详情每张图片大小不能超过1MB
                                </br>
                                文字不许超过1000字
                                </br>
                                图片将以等宽不等高的方式展示在使用端
                            </div>
                            <quill-editor v-if="training_type  >> 0 === 1" ref="myTextEditor" v-model="modify_form.content"
                            :options="editorOption" @showImageUI="imageHandler">
                            </quill-editor>
                        </el-tooltip>
                    </el-form-item>
                    <input type="file" name="file" id="fileinput" @change="customimgupload($event)"
                    style="display: none;">
                </template>
                <template v-else>
                    <el-form-item label="视频地址:">
                        <el-input v-model="modify_form.video_url" placeholder="请输入视频地址">
                        </el-input>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="modifyTrainingInfo">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="less">
    #trainingList{
        box-sizing: border-box;

        width: 100%;
        height: 100%;
        
        padding: 30px;
        background: #fff;

        overflow: hidden;
        label{
            color: #8492A6;
        }
        .trainingList_body_wrap{
            box-sizing: border-box;

            width: 100%;
            height: 100%;

            padding-bottom: 73px;
            .trainingList_body{
                display: flex;
                flex-direction: column;

                width: 100%;
                height: 100%;
                .table_body{
                    width: 100%;
                    flex: 1;
                }
                .pagination{
                    width: 100%;
                    height: 30px;

                    margin-top: 30px;
                }
            }
        }
    }
    .el-dialog__wrapper{
        z-index: 999999 !important;
    }
</style>

<script>
import { removeTraining, modifyTrainingInfo, handleTrainingRecommend, listTrainingInfo, getTrainingClassifyList } from '../assets/axios/api.js'
import * as API from '../assets/axios/api.js'
export default{
    name: 'trainingList',
    data () {
        return {
            editorOption: {}, // 富文本对象
            form: {
                training_classify: '', // 培训分类:
                training_classify_list: [], // 服务端获取分类
                training_type: '', // 培训类型
                keyword: '' // 关键字
            },
            training_list: [], // 培训列表
            current_page: 1, // 当前页
            total_pages: 1, // 总页数
            dialogFormVisible: false, // 修改对话框
            modify_form: { // 修改数据
                training_id: '', // 修改信息id
                training_title: '', // 培训标题
                training_classify: '', // 培训分类
                thumb_image_url: '', // 培训缩略图:
                content: '', // 富文本展示
                video_url: '' // 视频地址
            },
            training_type: '1' // 培训类型
        }
    },
    watch: {
        training_type: function (val) {
            if (val === '2') {
                var aEle = document.getElementById('myQuill').getElementsByTagName('*')
                for (let i = 0; i < aEle.length; i++) {
                    /* 当className相等时添加到数组中*/
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
        this.getTrainingList() // 获取培训列表
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
        // 删除
        removeTraining (id, index, list) {
            const Data = {
                training_id: id >> 0
            }
            this.$confirm('是否确认删除该培训课程?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$axios.post(removeTraining, Data)
                .then(msg => {
                    const data = msg.data
                    switch (data.flag) {
                    case 1000:
                        this.$message({
                            message: '培训信息删除成功',
                            type: 'success'
                        })
                        list.splice(index, 1)
                        this.searchTraining()
                        break
                    default:
                        this.$message.error('培训信息删除失败,请重试')
                        break
                    }
                })
                .catch(error => {
                    this.$message.error('服务器异常')
                })
            })
        },

        // 提交修改数据
        modifyTrainingInfo () {
            if (this.modify_form.training_classify) {
                if (this.modify_form.thumb_image_url) {
                    let Data = null
                    switch (this.training_type) {
                    case '1':
                        Data = {
                            training_id: this.modify_form.training_id,
                            training_classify: this.modify_form.training_classify,
                            training_type: this.training_type,
                            thumb_image_url: this.modify_form.thumb_image_url,
                            training_value: this.modify_form.content,
                            request_flag: 'modify'
                        }
                        this.modifyTrainingInfoAxios(Data)
                        break
                    case '2':
                        Data = {
                            training_id: this.modify_form.training_id,
                            training_classify: this.modify_form.training_classify,
                            training_type: this.training_type,
                            thumb_image_url: this.modify_form.thumb_image_url,
                            training_value: this.modify_form.video_url,
                            request_flag: 'modify'
                        }
                        this.modifyTrainingInfoAxios(Data)
                        break
                    default:
                        break
                    }
                } else {
                    this.$message.error('请上传培训缩略图')
                }
            } else {
                this.$message.error('请选择培训分类')
            }
        },

        modifyTrainingInfoAxios (Data) {
            this.$axios.post(modifyTrainingInfo, Data)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.searchTraining()
                    this.$message({
                        message: '培训信息修改成功',
                        type: 'success'
                    })
                    this.dialogFormVisible = false
                    break
                default:
                    this.$message.error('设置失败,请重试')
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
                this.modify_form.thumb_image_url = res.file_url
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

        // 修改获取数据
        getModifyTrainingInfo (id) {
            this.modify_form.content = ''
            const Data = {
                training_id: id
            }
            this.$axios.post(modifyTrainingInfo, Data)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.modify_form = {
                        training_id: data.training_detail.id, // 修改信息id
                        training_title: data.training_detail.title, // 培训标题:
                        training_classify: data.training_detail.classify_id >> 0, // 培训分类:
                        thumb_image_url: data.training_detail.thumb_image // 培训缩略图:
                    }
                    this.training_type = data.training_detail.type_id // 培训类型
                    switch (data.training_detail.type_id) {
                    case '1':
                        this.modify_form.content = data.training_detail.training_value
                        break
                    case '2':
                        this.modify_form.video_url = data.training_detail.training_value
                        break
                    default:
                        this.modify_form.video_url = ''
                        break
                    }

                    this.dialogFormVisible = true
                    break
                default:
                    break
                }
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        },

        // 置顶设置
        handleTrainingRecommend (training_id, training_recommend) {
            const Data = {
                training_id: training_id,
                training_recommend: training_recommend
            }
            this.$confirm('推荐后会优先置顶显示, 是否确认推荐?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$axios.post(handleTrainingRecommend, Data)
                .then(msg => {
                    const data = msg.data
                    switch (data.flag) {
                    case 1000:
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        })
                        this.getTrainingList()
                        break
                    case 9009:
                        this.$message({
                            message: '推荐课程最多显示10条,请先取消一条推荐课程在尝试',
                            type: 'warning'
                        })
                        this.getTrainingList()
                        break
                    default:
                        this.$message.error('设置失败,请重试')
                        this.initData()
                        break
                    }
                })
                .catch(error => {
                    this.$message.error('服务器异常')
                })
            })
        },

        // 数据初始化
        initData () {
            this.training_list = []
            this.total_pages = 1
            this.current_page = 1
        },

        // 分页
        handleCurrentChange (val) {
            const Data = {
                training_classify: this.form.training_classify,
                training_type: this.form.training_type,
                keyword: this.form.keyword,
                current_page: val
            }
            this.getTrainingList(Data)
        },

        // 搜索
        searchTraining () {
            const Data = {
                training_classify: this.form.training_classify,
                training_type: this.form.training_type,
                keyword: this.form.keyword,
                current_page: 1
            }
            this.$axios.post(listTrainingInfo, Data)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.$message({
                        message: '数据获取成功',
                        type: 'success'
                    })
                    this.training_list = data.training_list
                    this.current_page = data.current_page
                    this.total_pages = data.pages
                    break
                case 9001:
                    this.$message({
                        message: '暂无该培训数据',
                        type: 'warning'
                    })
                    this.initData()
                    break
                default:
                    this.$message.error('暂无该培训数据,请重试')
                    this.initData()
                    break
                }
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        },

        // 获取列表
        getTrainingList (Data) {
            this.$axios.post(listTrainingInfo, Data)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.training_list = data.training_list
                    this.current_page = data.current_page
                    this.total_pages = data.pages
                    break
                case 9001:
                    this.$message({
                        message: '请先添加至少一条培训',
                        type: 'warning'
                    })
                    this.initData()
                    break
                default:
                    this.$message.error('获取培训列表失败,请重试')
                    this.initData()
                    break
                }
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        },

        // 获取分类
        getTrainingClassifyList () {
            this.$axios.post(getTrainingClassifyList)
            .then(msg => {
                const data = msg.data
                switch (data.flag) {
                case 1000:
                    this.form.training_classify_list = data.training_classify_list
                    break
                case 9001:
                    this.$message({
                        message: '请先添加至少一条培训分类',
                        type: 'success'
                    })
                    break
                default:
                    this.$message.error('获取分类失败,请重试')
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
