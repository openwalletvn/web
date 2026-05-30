import type { Meta, StoryObj } from '@storybook/react'
import { OwAccordion } from './ow-accordion'

const meta: Meta<typeof OwAccordion> = {
  title: 'OW UI/OwAccordion',
  component: OwAccordion,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof OwAccordion>

const sampleItems = [
  {
    value: '1',
    trigger: 'Thẻ tín dụng hoàn tiền là gì?',
    content: 'Thẻ tín dụng hoàn tiền trả lại một phần chi tiêu dưới dạng tiền mặt hoặc điểm quy đổi.',
  },
  {
    value: '2',
    trigger: 'Lãi suất thẻ tín dụng được tính như thế nào?',
    content: 'Lãi suất tính trên dư nợ chưa thanh toán sau ngày đáo hạn, thường từ 1.5% đến 3.5%/tháng.',
  },
  {
    value: '3',
    trigger: 'Có nên mở nhiều thẻ tín dụng không?',
    content: 'Phụ thuộc vào khả năng quản lý tài chính. Nhiều thẻ cho phép tận dụng ưu đãi từng loại nhưng cần kiểm soát chi tiêu chặt chẽ.',
  },
]

export const Default: Story = {
  args: {
    items: sampleItems,
    type: 'single',
    collapsible: true,
  },
}

export const Multiple: Story = {
  args: {
    items: sampleItems,
    type: 'multiple',
    defaultValue: ['1', '2'],
  },
}

export const AllOpen: Story = {
  args: {
    items: sampleItems,
    type: 'multiple',
    defaultValue: ['1', '2', '3'],
  },
}
