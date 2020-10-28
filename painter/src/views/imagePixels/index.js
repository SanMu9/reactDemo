import React from 'react'
import { Layout,Upload,Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import './index.css'

import CanvasPanel from '../../components/CanvasPanel/index2';
// import PixelsPanel from '../../components/PixelsPanel/index2';

import {useState} from 'react'


const {Sider,Content} = Layout;

// const UploadProps = {
//     accept:"image/*",
//     multiple:false
// }

function ImagePixels(){

    const [fileList,setFileList] = useState([]);
    const [fileSelected,selectFile] = useState(null);
    const [removedId,setRemovedId] = useState(null)

    const uploadProps = {
        multiple:true,
        accept:"image/*",
   
        onPreview:(file) => {
            selectFile(file)
        },
        beforeUpload:(file,flist) => {
            setFileList([...fileList,...flist])
            selectFile(file)
            return false;
        },
        onRemove:file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index,1);

            setRemovedId(file.uid)
            selectFile(null)
            setFileList(newFileList);
        },
        fileList
    }
    const canvasPanelProps = {
        fileSelected,
        removedId
    }

    return (
        <Layout className="container">
            <Sider className="sider" theme="light">
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
            </Sider>
            <Content className="main">
                <CanvasPanel {...canvasPanelProps}></CanvasPanel>
                {/* <PixelsPanel {...canvasPanelProps}></PixelsPanel> */}
            </Content>
        </Layout>
    )
}

export default ImagePixels