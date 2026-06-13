#!/usr/bin/env python3
"""
super lightweight avatar generator — optimized for CPU
generates a professional abstract gradient avatar using PIL + gaussian blobs
~2-3 seconds on this machine
"""

import math, random, colorsys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

def hsv_rgb(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (int(r*255), int(g*255), int(b*255))

def generate_avatar(size=512, output_path=None):
    """Generate a professional abstract gradient avatar using blob compositing."""
    
    # Start with transparent background
    base = Image.new('RGBA', (size, size), (0,0,0,0))
    
    # ── Gradient blobs (fast: draw filled circles + gaussian blur) ──
    blobs = [
        # (cx_ratio, cy_ratio, h, s, v, radius_ratio)
        (0.30, 0.35, 0.76, 0.72, 0.28, 0.65),   # deep purple
        (0.65, 0.45, 0.82, 0.68, 0.38, 0.55),   # violet
        (0.45, 0.72, 0.88, 0.62, 0.32, 0.50),   # magenta
        (0.80, 0.28, 0.55, 0.55, 0.42, 0.40),   # cyan accent
        (0.18, 0.78, 0.72, 0.58, 0.22, 0.45),   # dark purple
    ]
    
    for cx, cy, h, s, v, r in blobs:
        layer = Image.new('RGBA', (size, size), (0,0,0,0))
        ldraw = ImageDraw.Draw(layer)
        px = int(cx * size)
        py = int(cy * size)
        radius = int(r * size)
        color = hsv_rgb(h, s, v) + (255,)
        ldraw.ellipse([px - radius, py - radius, px + radius, py + radius], fill=color)
        # Blur to create smooth gradient
        layer = layer.filter(ImageFilter.GaussianBlur(radius=radius//3))
        base = Image.alpha_composite(base, layer)
    
    # ── Subtle noise texture ──────────────────────────────────────
    random.seed(42)
    noise = Image.new('RGBA', (size, size), (0,0,0,0))
    ndraw = ImageDraw.Draw(noise)
    for _ in range(2000):
        x = random.randint(0, size-1)
        y = random.randint(0, size-1)
        n = random.randint(0, 35)
        ndraw.point((x, y), (n, n, n, 20))
    noise = noise.filter(ImageFilter.GaussianBlur(radius=4))
    base = Image.alpha_composite(base, noise)
    
    # ── Abstract organic silhouette ────────────────────────────────
    overlay = Image.new('RGBA', (size, size), (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    
    cx, cy = size * 0.5, size * 0.43
    
    # Head oval
    head_col = hsv_rgb(0.78, 0.28, 0.82) + (70,)
    od.ellipse([
        cx - size*0.27, cy - size*0.33,
        cx + size*0.27, cy + size*0.36,
    ], fill=head_col)
    
    # Jaw
    od.ellipse([
        cx - size*0.20, cy + size*0.06,
        cx + size*0.20, cy + size*0.42,
    ], fill=head_col)
    
    # Shoulders suggestion
    shoulder_col = hsv_rgb(0.74, 0.48, 0.18) + (55,)
    od.ellipse([
        cx - size*0.34, cy + size*0.18,
        cx + size*0.34, cy + size*0.52,
    ], fill=shoulder_col)
    
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=15))
    base = Image.alpha_composite(base, overlay)
    
    # ── Accent glow ring ───────────────────────────────────────────
    glow = Image.new('RGBA', (size, size), (0,0,0,0))
    gd = ImageDraw.Draw(glow)
    glow_col = hsv_rgb(0.55, 0.60, 0.50) + (25,)  # subtle cyan ring
    gd.ellipse([
        size*0.08, size*0.08,
        size*0.92, size*0.92,
    ], outline=glow_col, width=2)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
    base = Image.alpha_composite(base, glow)
    
    # ── Polish ────────────────────────────────────────────────────
    base = base.filter(ImageFilter.GaussianBlur(radius=1))
    
    # Slight brightness bump
    base = ImageEnhance.Brightness(base).enhance(1.08)
    base = ImageEnhance.Contrast(base).enhance(1.03)
    
    # ── Save ──────────────────────────────────────────────────────
    if output_path:
        base.save(output_path, 'PNG')
        print(f"saved: {output_path} ({size}x{size})")
    
    return base

if __name__ == '__main__':
    import sys, time
    path = sys.argv[1] if len(sys.argv) > 1 else 'avatar.png'
    t0 = time.time()
    generate_avatar(512, path)
    print(f"done in {time.time() - t0:.2f}s")
