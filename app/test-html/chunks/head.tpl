{% set data = {
  zxc: 'its zxc!',
  asd: 'its asd!'
} | _merge(data.headData) %}


{{ data.zxc }}