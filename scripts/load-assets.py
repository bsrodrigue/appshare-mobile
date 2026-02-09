import os
import re

# Configuration
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ASSETS_DIR = os.path.join(PROJECT_ROOT, 'assets')
OUTPUT_FILE = os.path.join(PROJECT_ROOT, 'libs', 'assets', 'index.ts')

# Supported extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'}

def to_camel_case(snake_str):
    components = re.split(r'[-_\s\.]', snake_str)
    # Filter out empty strings
    components = [c for c in components if c]
    if not components:
        return ""
    return components[0].lower() + ''.join(x.title() for x in components[1:])

def sanitize_key(key):
    # Remove invalid characters, handle numbers at start
    key = re.sub(r'[^a-zA-Z0-9_]', '', key)
    if key and key[0].isdigit():
        key = '_' + key
    return key

def get_relative_path(from_path, to_path):
    return os.path.relpath(to_path, os.path.dirname(from_path))

def scan_directory(directory, base_dir):
    structure = {}
    
    try:
        items = sorted(os.listdir(directory))
    except FileNotFoundError:
        return {}

    for item in items:
        full_path = os.path.join(directory, item)
        
        if os.path.isdir(full_path):
            # Recursively scan subdirectories
            sub_structure = scan_directory(full_path, base_dir)
            if sub_structure:
                key = to_camel_case(item)
                key = sanitize_key(key)
                structure[key] = sub_structure
        else:
            ext = os.path.splitext(item)[1].lower()
            if ext in IMAGE_EXTENSIONS:
                # It's an image
                filename_no_ext = os.path.splitext(item)[0]
                # Handle @2x, @3x by ignoring them if base exists? 
                # Or just include them? React Native handles resolution automatically if named correctly.
                # Usually we just import the base name if we want RN to handle it, 
                # BUT if we are generating a map, we might pick up all of them.
                # However, typically you import 'image.png' and RN picks 'image@2x.png' if needed.
                # So we should probably skip files ending in @2x, @3x if the base exists?
                # For simplicity, let's just map everything for now, or maybe filter @2x/@3x to avoid clutter 
                # if the base file is present. 
                # Actually, standard practice: require('./image.png') works for all densities.
                # So we should filter out @2x and @3x from the keys, but we need to ensure we point to the base file?
                # No, if we point to 'image.png', RN looks for 'image@2x.png'.
                # If 'image.png' doesn't exist but 'image@2x.png' does, we might have an issue.
                # Let's assume standard structure: base file exists.
                
                if '@' in filename_no_ext:
                    continue
                
                key = to_camel_case(filename_no_ext)
                key = sanitize_key(key)
                
                # Calculate relative path for require
                rel_path = get_relative_path(OUTPUT_FILE, full_path)
                # Ensure forward slashes for JS
                rel_path = rel_path.replace(os.sep, '/')
                if not rel_path.startswith('.'):
                    rel_path = './' + rel_path
                    
                structure[key] = f"require('{rel_path}')"
                
    return structure

def generate_ts_object(structure, indent=2):
    lines = []
    for key, value in structure.items():
        if isinstance(value, dict):
            lines.append(f"{' ' * indent}{key}: {{")
            lines.append(generate_ts_object(value, indent + 2))
            lines.append(f"{' ' * indent}}},")
        else:
            lines.append(f"{' ' * indent}{key}: {value},")
    return '\n'.join(lines)

def main():
    print(f"Scanning assets in {ASSETS_DIR}...")
    
    # We specifically want to group by file format. 
    # Currently only images.
    # We can look into assets/images directly or scan root assets and classify.
    
    images_dir = os.path.join(ASSETS_DIR, 'images')
    images_structure = scan_directory(images_dir, ASSETS_DIR)
    
    # If there are images at the root of assets (not in images/), we might miss them if we only scan assets/images.
    # But the user said "classify by file format".
    # Let's just scan assets/images for now as per directory structure seen.
    
    ts_content = "export class Assets {\n"
    
    if images_structure:
        ts_content += "  static images = {\n"
        ts_content += generate_ts_object(images_structure, 4)
        ts_content += "\n  };\n"
    else:
        ts_content += "  static images = {};\n"
        
    ts_content += "}\n"
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w') as f:
        f.write(ts_content)
        
    print(f"Generated {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
