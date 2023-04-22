import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
	
	let dead_name = [];
let alive_name = [];
let normalized_list = [];

function normalize_input(name_list) {
  let name_list_before = name_list.split('\n');
  let remove_spaces_regex = /\s*|\u300*/g;
  for (let name_list_after of name_list_before) {
    name_list_after = name_list_after.replace(remove_spaces_regex, '');
    if (name_list_after !== '') {
      alive_name.push(name_list_after);
    }
  }
  normalized_list = alive_name.slice();
  console.log(alive_name);
}

function choose_name() {
  let chosen_name = alive_name[Math.floor(Math.random() * alive_name.length)];
  console.log('=======================');
  console.log(chosen_name + 'さんが選ばれました。');
  console.log('=======================');
  return chosen_name;
}

function chosen_name_remove_or_not(chosen_name) {
  console.log('もう一回？OKならエンターキーを？、もう一回なら1を入力後エンターキーを!:');
  let which = prompt();
  if (!which) {
    dead_name.push(chosen_name);
    let index = alive_name.indexOf(chosen_name);
    alive_name.splice(index, 1);
  } else {
    console.log('もう一回がんばれ！');
  }
}

function print_dead_alive() {
  console.log('=======================');
  console.log('alive');
  console.log(alive_name);
  console.log('=======================');
  console.log('dead');
  console.log(dead_name);
  console.log('=======================');
}

function name_lotation() {
  let USER_INPUT_TIME = 2.5;
  let start_time = new Date().getTime() / 1000;
  while (new Date().getTime() / 1000 - start_time < USER_INPUT_TIME) {
    console.log(alive_name[Math.floor(Math.random() * alive_name.length)]);
    setTimeout(() => {}, 25);
  }
}

function execute(name_list) {
  normalize_input(name_list);
  while (alive_name.length) {
    let chosen_name = choose_name();
    chosen_name_remove_or_not(chosen_name);
    print_dead_alive();
    name_lotation();
  }
}

let name_list = `
山田　太郎
田中 次郎
佐藤 三郎
伊藤 四郎
渡辺 五郎
鈴木 六郎
高橋　七郎
田村 八郎
加藤九郎
吉田 十郎
松本 十一郎
山口 十二郎
中村 十三郎
小林 十四郎
斎
  )
}
