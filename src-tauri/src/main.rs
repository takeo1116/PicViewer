use std::fs;
use std::path::Path;
use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageFile {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub tags: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TagData {
    pub images: std::collections::HashMap<String, Vec<String>>,
}

#[command]
fn read_directory(path: String) -> Result<Vec<ImageFile>, String> {
    let dir = Path::new(&path);
    if !dir.exists() {
        return Err("Directory does not exist".to_string());
    }

    let mut images = Vec::new();
    let entries = fs::read_dir(dir).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        if path.is_file() {
            if let Some(extension) = path.extension() {
                let ext = extension.to_string_lossy().to_lowercase();
                if matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp") {
                    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
                    let file_name = path.file_name()
                        .unwrap_or_default()
                        .to_string_lossy()
                        .to_string();
                    
                    let tags = load_tags_for_image(&path.to_string_lossy()).unwrap_or_default();
                    
                    images.push(ImageFile {
                        path: path.to_string_lossy().to_string(),
                        name: file_name,
                        size: metadata.len(),
                        tags,
                    });
                }
            }
        }
    }

    Ok(images)
}

#[command]
fn load_tags_for_image(image_path: String) -> Result<Vec<String>, String> {
    let image_path = Path::new(&image_path);
    let parent_dir = image_path.parent().ok_or("Invalid image path")?;
    let picviewer_dir = parent_dir.join(".picviewer");
    let tags_file = picviewer_dir.join("tags.json");

    if !tags_file.exists() {
        return Ok(vec![]);
    }

    let content = fs::read_to_string(&tags_file).map_err(|e| e.to_string())?;
    let tag_data: TagData = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    let image_name = image_path.file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    
    Ok(tag_data.images.get(&image_name).cloned().unwrap_or_default())
}

#[command]
fn save_tags_for_image(image_path: String, tags: Vec<String>) -> Result<(), String> {
    let image_path = Path::new(&image_path);
    let parent_dir = image_path.parent().ok_or("Invalid image path")?;
    let picviewer_dir = parent_dir.join(".picviewer");
    let tags_file = picviewer_dir.join("tags.json");

    if !picviewer_dir.exists() {
        fs::create_dir_all(&picviewer_dir).map_err(|e| e.to_string())?;
    }

    let mut tag_data = if tags_file.exists() {
        let content = fs::read_to_string(&tags_file).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).unwrap_or_else(|_| TagData {
            images: std::collections::HashMap::new(),
        })
    } else {
        TagData {
            images: std::collections::HashMap::new(),
        }
    };

    let image_name = image_path.file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    
    tag_data.images.insert(image_name, tags);

    let json = serde_json::to_string_pretty(&tag_data).map_err(|e| e.to_string())?;
    fs::write(&tags_file, json).map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_directory,
            load_tags_for_image,
            save_tags_for_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}