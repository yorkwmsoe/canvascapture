// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate dirs;
use std::io::Read;

#[tauri::command]
fn read_config() -> String {
  let dir = dirs::config_dir().expect("Unable to get config directory");
  let path = format!("{}/canvas-capture-desktop", dir.display());
  let file_path = format!("{}/config.json", path);
  std::fs::create_dir_all(path).expect("Unable to create config directory");
  let mut file = std::fs::OpenOptions::new().write(true).create(true).read(true).open(file_path).expect("Unable to open file");
  let mut contents = String::new();
  file.read_to_string(&mut contents).expect("Unable to read file");
  return contents;
}

#[tauri::command]
fn write_config(config: String) {
  let dir = dirs::config_dir().expect("Unable to get config directory");
  let path = format!("{}/canvas-capture-desktop", dir.display());
  let file_path = format!("{}/config.json", path);
  std::fs::write(file_path, config).expect("Unable to write file");
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_config, write_config])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
