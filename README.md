# Color Components - 设计系统组件库

基于NFT市场项目重构的现代化设计系统，采用DRY原则构建可复用的UI组件库。

## 🎨 设计系统特性

### ✅ 已实现功能
- **完整的设计令牌系统** - 颜色、字体、间距、圆角、阴影等统一规范
- **重构的Button组件** - 9种视觉变体，6种尺寸，支持图标、加载状态
- **增强的Card组件** - 6种视觉风格，支持交互、图片、徽章等扩展功能
- **专业的NFT组件** - NFT卡片、集合卡片、网格布局等专用组件
- **响应式Header组件** - 支持多种变体（默认/透明/玻璃效果）
- **组件预览页面** - 完整的组件展示和测试环境
- **TypeScript支持** - 完整的类型定义和智能提示

### 🎯 核心优势
- **DRY原则** - 消除重复代码，统一样式管理
- **设计一致性** - 基于设计令牌保证视觉统一
- **高度可定制** - 支持变体、尺寸、主题等灵活配置
- **无障碍支持** - 遵循WAI-ARIA标准，支持键盘导航
- **性能优化** - 使用class-variance-authority优化样式计算

## 📁 项目结构

```
components/
├── ui/                          # UI组件库
│   ├── button/                 # 按钮组件
│   │   ├── button.tsx         # 主组件实现
│   │   └── index.ts           # 组件导出
│   ├── card/                   # 卡片组件
│   ├── nft-card/              # NFT专用组件
│   ├── header/                # 头部导航组件
│   ├── container/             # 布局容器组件
│   ├── badge/                 # 徽章组件
│   ├── input/                 # 输入框组件
│   └── index.ts               # 统一导出
├── theme-provider.tsx         # 主题提供者
└── ...

lib/
├── design-tokens.ts           # 设计令牌（TypeScript）
└── ...

styles/
├── design-tokens.css          # 设计令牌（CSS）
└── ...

app/
├── playground/                # 组件预览页面
│   └── page.tsx              # 组件展示页面
└── ...
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:3000/playground 查看组件预览
```

### 3. 使用组件
```tsx
import { Button, Card, NFTCard, Header } from '@/components/ui'

export default function MyPage() {
  return (
    <div>
      <Header / >
      <Card variant="elevated">
        <Button variant="primary" size="lg">
          Primary Button
        </Button>
      </Card>

      <NFTCard
        name="My NFT"
        price="1.5"
        likes={42}
        image="/path/to/image.jpg"
      />
    </div>
  )
}
```

## 🧩 组件概览

### Button 组件
```tsx
<Button variant="primary" size="lg" leftIcon={<Heart/>}>
  Like
</Button>

<ButtonGroup>
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>

<IconButton icon={<Search/>} aria-label="Search" />
```

### Card 组件
```tsx
<Card variant="elevated" interactive="clickable">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

### NFT Card 组件
```tsx
<NFTCard
  name="Bored Ape #1234"
  price="125.65"
  currency="ETH"
  likes={26}
  views={120}
  image="/nft-image.jpg"
  isLiked={true}
  showActions={true}
  onLike={() => console.log('Liked!')}
  onBuy={() => console.log('Buy now!')}
/>

<NFTGrid columns={4} gap="md">
  <NFTCard ... />
  <NFTCard ... />
  <NFTCard ... />
</NFTGrid>
```

## 🎨 设计令牌

### 颜色系统
```css
/* 主要颜色 */
--color-primary-500: oklch(0.75 0.22 45)
--color-secondary-500: oklch(0.75 0.22 270)
--color-accent-500: oklch(0.75 0.22 180)

/* 中性色 */
--color-neutral-0: oklch(1 0 0)      /* 纯白 */
--color-neutral-500: oklch(0.75 0 0)
--color-neutral-1000: oklch(0 0 0)  /* 纯黑 */
```

### 字体系统
```css
/* 字体大小 */
--font-size-xs: 0.75rem     /* 12px */
--font-size-base: 1rem      /* 16px */
--font-size-6xl: 3.75rem    /* 60px */

/* 字重 */
--font-weight-normal: 400
--font-weight-bold: 700
```

### 间距系统
```css
--spacing-1: 0.25rem      /* 4px */
--spacing-4: 1rem         /* 16px */
--spacing-8: 2rem         /* 32px */
```

## 🔧 开发指南

### 添加新组件
1. 在 `components/ui/` 下创建组件文件夹
2. 遵循现有组件的代码结构和命名规范
3. 使用设计令牌而非硬编码值
4. 提供完整的 TypeScript 类型定义
5. 在 `index.ts` 中导出组件
6. 在 `playground/page.tsx` 中添加展示示例

### 组件设计原则
- **单一职责** - 每个组件只做一件事
- **可组合性** - 组件可以灵活组合使用
- **可访问性** - 支持键盘导航和屏幕阅读器
- **响应式设计** - 适配不同屏幕尺寸
- **主题支持** - 支持亮色/暗色主题切换

## 🌟 特色功能

### 1. 智能样式系统
使用 `class-variance-authority` 实现类型安全的样式变体：
```tsx
const buttonVariants = cva(
  'base-styles',
  {
    variants: {
      variant: { primary: '...', secondary: '...' },
      size: { sm: '...', md: '...', lg: '...' }
    }
  }
)
```

### 2. 设计令牌集成
所有组件都基于统一的设计令牌，确保视觉一致性：
```tsx
import { colors, spacing, radius } from '@/lib/design-tokens'
```

### 3. 暗色主题支持
自动适配系统主题偏好，支持手动切换：
```tsx
<ThemeProvider defaultTheme="dark">
  {children}
</ThemeProvider>
```

## 📱 响应式断点

```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

## 🔍 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 支持 CSS 自定义属性 (CSS Variables)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如有问题，请在 GitHub Issues 中提交。

---

**设计系统状态**: ✅ 基础版本完成
**最后更新**: 2024年1月
**维护团队**: 前端架构团队

访问 [http://localhost:3000/playground](http://localhost:3000/playground) 查看所有组件的实时演示！ 🚀