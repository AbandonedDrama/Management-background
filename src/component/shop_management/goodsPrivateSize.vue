<template>
    <div id="goodsPrivateSize">
        <el-col :span="24" style="height: 100%; width: 100%;">
            <!-- 头部 -->
            <div class="goodsPrivateSize_top">
                <span>商品尺寸</span>
                <el-button class="OI" type="text" @click="dialogVisible = true">操作说明</el-button>
            </div>
            <div class="goodsPrivateSize_form_wrap">
                <div class="goodsPrivateSize_form_body sx_basis_scroll sx_scroll_style">
                    <el-form
                        :model="goodsPrivatePropertyValues"
                        :rules="goodsPrivatePropertyValuesRules"
                        ref="goodsPrivatePropertyValues"
                        label-position="top"
                        class="goodsPrivateSize_form">
                        <el-form-item label="商品品牌" prop="commodityBrand">
                            <el-select 
                                v-model="goodsPrivatePropertyValues.commodityBrand" 
                                placeholder="请选择商品品牌" 
                                @change="getParentId">
                            <el-option 
                                v-for="item in goodsPrivatePropertyValues.commodityBrandList" 
                                :label="item.product_name" 
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="commodityClassification">
                            <el-select v-model="goodsPrivatePropertyValues.commodityClassification" placeholder="请选择商品分类" @change="getParentId">
                            <el-option 
                                v-for="item in goodsPrivatePropertyValues.commodityClassificationList" 
                                :label="item.category_name" 
                                :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="商品尺寸" prop="goodsPrivatePropertyValuesText">
                            <el-tag
                                v-for="tag in goodsPrivatePropertyValues.dynamicTags"
                                :closable="true"
                                :close-transition="false"
                                @close="handleClose(tag)"
                                type="primary"
                                style="width: 217px;">
                                {{tag}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="goodsPrivatePropertyValues.inputVisible"
                                v-model="goodsPrivatePropertyValues.inputValue"
                                ref="saveTagInput"
                                size="mini"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                                style="width: 217px;">
                            </el-input>
                            <el-button v-else class="button-new-tag" @click="showInput">添加</el-button>
                        </el-form-item></br>

                        <el-form-item>
                            <el-button type="primary" @click="submitForm('goodsPrivatePropertyValues')">提交</el-button>
                        </el-form-item>
                    </el-form>
                
                </div>
            </div>
        </el-col>

        <!-- 提示用户页面操作须知 -->
        <el-dialog title="操作说明" v-model="dialogVisible" size="tiny">
        <span>1.仅针对自有品牌除本平台提供商品尺寸以外的自有商品尺寸的添加。</span></br>
        <span>2.您只能操作您自有商品尺寸。</span></br>
        <span>3.请注意文明用语!</span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<style lang="less">
    #goodsPrivateSize{
        width: 100%;
        height: 100%;
        
        background: #fff;

        overflow: hidden;
        .goodsPrivateSize_top{
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
        .goodsPrivateSize_form_wrap{
            box-sizing: border-box;

            width: 100%;
            height: 100%;
            
            padding-bottom: 50px;
            .goodsPrivateSize_form_body{
                width: 100%;
                height: 100%;
                .goodsPrivateSize_form{
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
import { addNewerCategoryArguments, addNewerGoodsInfo } from '../../assets/axios/api.js'
export default {
    name: 'goodsPrivateSize',
    data () {
        return {
            dialogVisible: false, // 消息提示控件
            goodsPrivatePropertyValues: {
                commodityBrand: '', // 商品品牌
                commodityBrandList: [],
                commodityClassification: '', // 商品分类
                commodityClassificationList: [],
                commodityClassificationProperties: '', // 商品属性
                commodityClassificationPropertiesList: [],
                dynamicTags: [], // 商品属性属性值
                inputVisible: false,
                inputValue: ''
            },
            parent_id: '', // 附属性ID 上传颜色前需请求给后端
            goodsPrivatePropertyValuesRules: { // 验证规则
                commodityBrand: [
                    { required: true, message: '请选择商品品牌', trigger: 'change' }
                ],
                commodityClassification: [
                    { required: true, message: '请选择商品分类', trigger: 'change' }
                ]
            }
        }
    },
    created: function () {
    // 初始化获取商品品牌和商品分类
        this.getCommodityBrandAndCommodityClassification()
    },
    methods: {
        // 获取附属性ID
        getParentId () {
            if (this.goodsPrivatePropertyValues.commodityBrand !== '' && this.goodsPrivatePropertyValues.commodityClassification !== '') {
                this.$axios.post(addNewerCategoryArguments, {
                    'product_id': this.goodsPrivatePropertyValues.commodityBrand,
                    'category_id': this.goodsPrivatePropertyValues.commodityClassification,
                    'request_flag': 'parent_list'
                })
                .then(msg => {
                    const data = msg.data

                    if (data.flag >> 0 !== 1000) {
                        this.$message.error('服务器异常')
                        return false
                    }
                    for (var i = data.parent_argument_list.length - 1; i >= 0; i--) {
                        if (data.parent_argument_list[i].argument_value === '尺寸') {
                            this.parent_id = data.parent_argument_list[i].id
                            break
                        }
                    }
                })
                .catch(error => {
                    this.$message.error('服务器异常')
                })
            }
        },

        // 上传尺寸
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    this.$message.error('请完善必填信息')
                    return false
                }
                if (!this.goodsPrivatePropertyValues.dynamicTags.length > 0) {
                    this.$message({
                        message: '请完善商品尺寸',
                        type: 'warning'
                    })
                    return false
                }
                this.$axios.post(addNewerCategoryArguments, {
                    'product_id': this.goodsPrivatePropertyValues.commodityBrand,
                    'category_id': this.goodsPrivatePropertyValues.commodityClassification,
                    'parent_id': this.parent_id,
                    'argument': this.goodsPrivatePropertyValues.dynamicTags
                })
                .then((msg) => {
                    const data = msg.data

                    if (data.flag >> 0 !== 1000) {
                        this.$message.error(data.return_code)
                        return false
                    }

                    this.$message({
                        message: data.return_code,
                        type: 'success'
                    })

                    setTimeout(() => {
                        this.resetForm('goodsPrivatePropertyValues')
                        this.goodsPrivatePropertyValues.dynamicTags = []
                        this.goodsPrivatePropertyValues.commodityClassificationPropertiesList = []
                    }, 1200)
                })
                .catch(error => {
                    this.$message.error('服务器异常')
                })
            })
        },

        resetForm (formName) {
            this.$refs[formName].resetFields()
            // 清空尺寸
            this.goodsPrivatePropertyValues.dynamicTags = []
        },

        // 获取商品品牌和商品分类
        getCommodityBrandAndCommodityClassification () {
            this.$axios.post(addNewerGoodsInfo, {
                'request_flag': 'product_list'
            })
            .then((msg) => {
                const data = msg.data

                if (data.flag >> 0 !== 1000) {
                    this.$message.error(data.return_code)
                    return false
                }

                // 商品品牌列表
                var product_list = data.product_list
                this.goodsPrivatePropertyValues.commodityBrandList = product_list

                // 商品分类列表
                var category_list = data.category_list
                this.goodsPrivatePropertyValues.commodityClassificationList = category_list
            })
            .catch(error => {
                this.$message.error('服务器异常')
            })
        },

        handleClose (tag) {
            this.goodsPrivatePropertyValues.dynamicTags.splice(this.goodsPrivatePropertyValues.dynamicTags.indexOf(tag), 1)
        },

        showInput () {
            this.goodsPrivatePropertyValues.inputVisible = true
        },

        handleInputConfirm () {
            const inputValue = this.goodsPrivatePropertyValues.inputValue
            if (inputValue) {
                this.goodsPrivatePropertyValues.dynamicTags.push(inputValue)
            }
            this.goodsPrivatePropertyValues.inputVisible = false
            this.goodsPrivatePropertyValues.inputValue = ''
        }
    }
}
</script>
