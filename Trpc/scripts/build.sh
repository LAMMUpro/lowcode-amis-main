#!/bin/bash
echo "请选择编译方式："
options=("tsc编译" "ncc打包" "webpack打包")
select opt in "${options[@]}"; do
  case $opt in
    "tsc编译")
      nest build
      break
      ;;
    "ncc打包")
      ncc build ./src/main.ts -m -t -o build
      break
      ;;
    "webpack打包")
      webpack --mode=production
      break
      ;;
    *) echo "请输入正确数字选项";;
  esac
done