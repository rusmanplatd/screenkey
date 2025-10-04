#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use evdev::{Device, InputEventKind, Key};
use serde::Serialize;
use std::sync::Mutex;
use tauri::{Emitter, Manager};

#[derive(Clone, Serialize)]
struct KeyEvent {
    key: String,
    modifiers: Vec<String>,
}

struct AppState {
    modifiers: Mutex<Vec<String>>,
}

fn key_to_string(key: Key) -> Option<String> {
    match key {
        Key::KEY_A => Some("A".to_string()),
        Key::KEY_B => Some("B".to_string()),
        Key::KEY_C => Some("C".to_string()),
        Key::KEY_D => Some("D".to_string()),
        Key::KEY_E => Some("E".to_string()),
        Key::KEY_F => Some("F".to_string()),
        Key::KEY_G => Some("G".to_string()),
        Key::KEY_H => Some("H".to_string()),
        Key::KEY_I => Some("I".to_string()),
        Key::KEY_J => Some("J".to_string()),
        Key::KEY_K => Some("K".to_string()),
        Key::KEY_L => Some("L".to_string()),
        Key::KEY_M => Some("M".to_string()),
        Key::KEY_N => Some("N".to_string()),
        Key::KEY_O => Some("O".to_string()),
        Key::KEY_P => Some("P".to_string()),
        Key::KEY_Q => Some("Q".to_string()),
        Key::KEY_R => Some("R".to_string()),
        Key::KEY_S => Some("S".to_string()),
        Key::KEY_T => Some("T".to_string()),
        Key::KEY_U => Some("U".to_string()),
        Key::KEY_V => Some("V".to_string()),
        Key::KEY_W => Some("W".to_string()),
        Key::KEY_X => Some("X".to_string()),
        Key::KEY_Y => Some("Y".to_string()),
        Key::KEY_Z => Some("Z".to_string()),
        Key::KEY_0 => Some("0".to_string()),
        Key::KEY_1 => Some("1".to_string()),
        Key::KEY_2 => Some("2".to_string()),
        Key::KEY_3 => Some("3".to_string()),
        Key::KEY_4 => Some("4".to_string()),
        Key::KEY_5 => Some("5".to_string()),
        Key::KEY_6 => Some("6".to_string()),
        Key::KEY_7 => Some("7".to_string()),
        Key::KEY_8 => Some("8".to_string()),
        Key::KEY_9 => Some("9".to_string()),
        Key::KEY_SPACE => Some("Space".to_string()),
        Key::KEY_ENTER => Some("Enter".to_string()),
        Key::KEY_BACKSPACE => Some("Backspace".to_string()),
        Key::KEY_TAB => Some("Tab".to_string()),
        Key::KEY_ESC => Some("Esc".to_string()),
        Key::KEY_UP => Some("↑".to_string()),
        Key::KEY_DOWN => Some("↓".to_string()),
        Key::KEY_LEFT => Some("←".to_string()),
        Key::KEY_RIGHT => Some("→".to_string()),
        Key::KEY_DELETE => Some("Delete".to_string()),
        Key::KEY_HOME => Some("Home".to_string()),
        Key::KEY_END => Some("End".to_string()),
        Key::KEY_PAGEUP => Some("PgUp".to_string()),
        Key::KEY_PAGEDOWN => Some("PgDn".to_string()),
        Key::KEY_F1 => Some("F1".to_string()),
        Key::KEY_F2 => Some("F2".to_string()),
        Key::KEY_F3 => Some("F3".to_string()),
        Key::KEY_F4 => Some("F4".to_string()),
        Key::KEY_F5 => Some("F5".to_string()),
        Key::KEY_F6 => Some("F6".to_string()),
        Key::KEY_F7 => Some("F7".to_string()),
        Key::KEY_F8 => Some("F8".to_string()),
        Key::KEY_F9 => Some("F9".to_string()),
        Key::KEY_F10 => Some("F10".to_string()),
        Key::KEY_F11 => Some("F11".to_string()),
        Key::KEY_F12 => Some("F12".to_string()),
        Key::KEY_LEFTSHIFT | Key::KEY_RIGHTSHIFT => Some("Shift".to_string()),
        Key::KEY_LEFTCTRL | Key::KEY_RIGHTCTRL => Some("Ctrl".to_string()),
        Key::KEY_LEFTALT | Key::KEY_RIGHTALT => Some("Alt".to_string()),
        Key::KEY_LEFTMETA | Key::KEY_RIGHTMETA => Some("Super".to_string()),
        Key::KEY_MINUS => Some("-".to_string()),
        Key::KEY_EQUAL => Some("=".to_string()),
        Key::KEY_LEFTBRACE => Some("[".to_string()),
        Key::KEY_RIGHTBRACE => Some("]".to_string()),
        Key::KEY_SEMICOLON => Some(";".to_string()),
        Key::KEY_APOSTROPHE => Some("'".to_string()),
        Key::KEY_GRAVE => Some("`".to_string()),
        Key::KEY_BACKSLASH => Some("\\".to_string()),
        Key::KEY_COMMA => Some(",".to_string()),
        Key::KEY_DOT => Some(".".to_string()),
        Key::KEY_SLASH => Some("/".to_string()),
        _ => None,
    }
}

fn is_modifier(key: Key) -> bool {
    matches!(
        key,
        Key::KEY_LEFTSHIFT
            | Key::KEY_RIGHTSHIFT
            | Key::KEY_LEFTCTRL
            | Key::KEY_RIGHTCTRL
            | Key::KEY_LEFTALT
            | Key::KEY_RIGHTALT
            | Key::KEY_LEFTMETA
            | Key::KEY_RIGHTMETA
    )
}

fn find_keyboard_devices() -> Vec<Device> {
    let mut keyboards = Vec::new();

    if let Ok(entries) = std::fs::read_dir("/dev/input") {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Some(name) = path.file_name() {
                if name.to_string_lossy().starts_with("event") {
                    if let Ok(device) = Device::open(&path) {
                        // Check if device has keyboard capabilities
                        if let Some(keys) = device.supported_keys() {
                            if keys.contains(Key::KEY_A) {
                                println!("Found keyboard device: {:?}", device.name());
                                keyboards.push(device);
                            }
                        }
                    }
                }
            }
        }
    }

    keyboards
}

fn main() {
    let state = AppState {
        modifiers: Mutex::new(Vec::new()),
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            let app_handle = app.handle().clone();

            std::thread::spawn(move || {
                println!("Starting keyboard listener...");
                let mut devices = find_keyboard_devices();

                if devices.is_empty() {
                    eprintln!("No keyboard devices found! Make sure to run with sudo.");
                    return;
                }

                println!("Monitoring {} keyboard device(s)", devices.len());

                loop {
                    let mut events_found = false;

                    for device in &mut devices {
                        while let Ok(events) = device.fetch_events() {
                            for event in events {
                                if let InputEventKind::Key(key) = event.kind() {
                                    events_found = true;
                                    let value = event.value();

                                    // value: 0 = release, 1 = press, 2 = repeat
                                    if value == 1 {
                                        // Key press
                                        if let Some(key_str) = key_to_string(key) {
                                            let state = app_handle.state::<AppState>();

                                            if is_modifier(key) {
                                                let mut mods = state.modifiers.lock().unwrap();
                                                if !mods.contains(&key_str) {
                                                    mods.push(key_str.clone());
                                                }
                                            } else {
                                                let mods = state.modifiers.lock().unwrap().clone();

                                                let key_event = KeyEvent {
                                                    key: key_str.clone(),
                                                    modifiers: mods.clone(),
                                                };

                                                println!(
                                                    "Key pressed: {} with modifiers: {:?}",
                                                    key_str, mods
                                                );
                                                if let Err(e) =
                                                    app_handle.emit("key-press", key_event)
                                                {
                                                    eprintln!("Failed to emit event: {:?}", e);
                                                }
                                            }
                                        }
                                    } else if value == 0 {
                                        // Key release
                                        if is_modifier(key) {
                                            if let Some(key_str) = key_to_string(key) {
                                                let state = app_handle.state::<AppState>();
                                                let mut mods = state.modifiers.lock().unwrap();
                                                mods.retain(|m| m != &key_str);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Sleep longer when no events to reduce CPU usage
                    let sleep_duration = if events_found { 1 } else { 10 };
                    std::thread::sleep(std::time::Duration::from_millis(sleep_duration));
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
