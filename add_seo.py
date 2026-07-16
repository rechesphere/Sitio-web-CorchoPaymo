import os
import glob
import re

html_files = [
    'aplicaciones.html',
    'certificaciones.html',
    'encapsulamiento-amianto.html',
    'index.html',
    'productos.html'
]

seo_line = " Si deseas <strong>comprar corcho proyectado al mejor precio</strong> para tu obra o reforma, no dudes en <strong>solicitar presupuesto sin compromiso</strong>; rellena nuestro formulario de contacto y un especialista te asesorará personalmente para garantizar el éxito de tu proyecto."

for file_path in html_files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We find the last </p> before </div>\n      <style> (which is the end of seo-columns)
        # Using a regex to find the last </p> within the seo-columns div
        pattern = re.compile(r'(<div[^>]*class="seo-columns"[^>]*>.*?)(</p>\s*</div>\s*<style>)', re.DOTALL)
        
        def repl(match):
            return match.group(1) + seo_line + match.group(2)
            
        new_content = pattern.sub(repl, content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
