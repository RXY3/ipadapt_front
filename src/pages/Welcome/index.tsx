import { Card } from 'antd';

export default () => {
  return (
    <div
      style={{
        padding: '40px 20px',
        minHeight: '100vh',
        background: '#fff',
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          backgroundImage:
            "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top',
          backgroundSize: '280px auto',
        }}
        bodyStyle={{
          padding: '48px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
            欢迎使用风格化图像生成平台（SIGIP）
          </h1>
          <p style={{ fontSize: '16px', marginTop: 8 }}>
            SIGIP 是一款融合 AI 艺术创作与社交互动的图像风格化平台，助你轻松打造独特的视觉作品。上传图像、选择风格或输入提示词，即可一键生成你专属的艺术头像！
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'center',
              marginTop: '40px',
            }}
          >
            {/* 平台主要功能 */}
            <Card
              title="⭐ 平台主要功能"
              style={{ flex: '1 1 500px', maxWidth: '620px', minHeight: '360px' }}
              bodyStyle={{ fontSize: '16px', lineHeight: 1.8 }}
            >
              <p>🎨 <b>图像风格化生成：</b> 借助先进的深度学习算法，自动将上传图像转换为目标风格图像，生成具有艺术感和个性化的视觉作品。</p>
              <p>🛠️ <b>创作工作台：</b> 提供模型选择、人脸图像上传、文本提示词等功能，支持用户创作与上传风格作品。</p>
              <p>🌐 <b>展示与互动社区：</b> 用户可发布作品、查看他人作品、评论点赞、关注作者，与其他创作者互动交流。</p>
              <p>📥 <b>作品管理与下载：</b> 支持用户管理个人创作记录、下载作品或一键发布到平台展示页。</p>
            </Card>

            {/* 使用指南 */}
            <Card
              title="🧭 使用指南"
              style={{ flex: '1 1 500px', maxWidth: '620px', minHeight: '360px' }}
              bodyStyle={{ fontSize: '16px', lineHeight: 1.8 }}
            >
              <p>🔐 <b>第一步：登录 / 注册账号</b><br /> 使用邮箱或第三方平台注册并登录，完善个人信息，开启创作之旅。</p>
              <p>📷 <b>第二步：进入创作工作台</b><br /> 上传人脸照片或实时拍摄，选择想要的风格（如汉服、日系等），或输入创作提示词（prompt）。</p>
              <p>🎨 <b>第三步：AI 生成风格图像</b><br /> 平台将智能生成与你输入相匹配的风格图像，过程快速自动。</p>
              <p>📤 <b>第四步：发布与互动</b><br /> 将作品一键发布至平台社区，与其他用户交流、点赞、评论、收获创作反馈。</p>
              <p>💾 <b>第五步：下载与管理</b><br /> 可下载高清图像至本地，或在个人主页中查看、管理作品记录。</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
