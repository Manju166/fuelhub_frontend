<Form.Item label="Is Recurring?" name="recurring">
<Radio.Group onChange={(e) => setIsRecurring(e.target.value)}>
  <Radio value={true}>True</Radio>
  <Radio value={false}>False</Radio>
</Radio.Group>
</Form.Item>

{isRecurring && (
<>
  <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
    <DatePicker required />
  </Form.Item>

  <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
    <DatePicker required />
  </Form.Item>
</>
)}

<Divider orientation="left">Delivery Order Attributes</Divider>

<Form.Item label="Delivery Planned At" name={['deliveryOrderAttributes', 'plannedAt']} rules={[{ required: true }]}>
<DatePicker format="YYYY-MM-DD" />
</Form.Item>

<Form.Item label="Delivery Completed At" name={['deliveryOrderAttributes', 'completedAt']} rules={[{ required: true }]}>
<DatePicker format="YYYY-MM-DD" />
</Form.Item>

<Form.Item label="Consumer Outlet ID" name={['deliveryOrderAttributes', 'consumerOutletId']} rules={[{ required: true }]}>
<Input type="number" />
</Form.Item>

<Divider orientation="left">Line Items</Divider>
<Form.List name="lineItems">
{(fields, { add, remove }) => (
  <>
    {fields.map(({ key, name, fieldKey, ...restField }) => (
      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        <Form.Item
          {...restField}
          name={[name, 'productId']}
          fieldKey={[fieldKey, 'productId']}
          rules={[{ required: true, message: 'Missing product ID' }]}
        >
          <Input placeholder="Product ID" type="number" />
        </Form.Item>
        <Form.Item
          {...restField}
          name={[name, 'status']}
          fieldKey={[fieldKey, 'status']}
          rules={[{ required: true, message: 'Missing status' }]}
        >
          <Select placeholder="Status">
            <Option value="scheduled">Scheduled</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </Form.Item>
        <Form.Item
          {...restField}
          name={[name, 'quantity']}
          fieldKey={[fieldKey, 'quantity']}
          rules={[{ required: true, message: 'Missing quantity' }]}
        >
          <Input placeholder="Quantity" type="number" />
        </Form.Item>