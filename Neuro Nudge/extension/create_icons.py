from cairosvg import svg2png
import os

def create_icon(size):
    svg_path = os.path.join('icons', 'icon.svg')
    png_path = os.path.join('icons', f'icon{size}.png')
    
    with open(svg_path, 'rb') as svg_file:
        svg2png(file_obj=svg_file, write_to=png_path, output_width=size, output_height=size)

def main():
    # Create icons for all required sizes
    sizes = [16, 48, 128]
    for size in sizes:
        create_icon(size)
        print(f'Created icon{size}.png')

if __name__ == '__main__':
    main() 