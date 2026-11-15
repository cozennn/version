# 审核协作别名

正文以别名表达职责；需要交接时在当前技能目录中按“技能标识”解析，读取其实际 SKILL.md，不猜安装路径。可选能力缺失时按主入口 fallback 采证，不安装替代品。

| 别名 | 技能标识 | 用途 |
|---|---|---|
| @product-audit | product-design:audit（可选） | 主任务与单屏审核 |
| @design-qa | Product Design 的 design-qa 路径（可选） | 设计稿与实现比对；按可用工具确认路径 |
| @web-test | example-skills:webapp-testing | 本地 Web 行为取证 |
| @critique | critique | 明确要求的五维评分 |
| @visual-compare | visual-verdict | 参考图与截图严格对照 |
| @marketing-design | design-taste-frontend | 营销页与作品集整改 |
| @frontend-design | example-skills:frontend-design | 一般前端视觉整改 |
| @react-bits | react-bits-ui | 已证实问题对应的单组件接入 |

## 本发布包中的可用性

@marketing-design 对应的 design-taste-frontend 已随包提供。其余外部技能均为可选项，不随本包安装。缺少时使用主入口的 review-checklist 和 web-interface-checks，配合实际可用浏览器/代码工具完成同等证据结构的审核；没有工具证据时标明未验证。

本包的 frontend-design 是 OpenDesign 视觉探索助手，不是 example-skills:frontend-design 的别名。只有无既有品牌的独立视觉探索才选择它；已有产品的修复优先沿用现有设计系统，不为缺少官方插件而替换品牌。
