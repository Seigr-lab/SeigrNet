#!/usr/bin/env python3
"""Test script to verify all pages and navigation work correctly."""

import urllib.request
import json

BASE_URL = "http://localhost:8000"

def test_page(url, description):
    """Test if a page loads successfully."""
    try:
        with urllib.request.urlopen(f"{BASE_URL}{url}") as response:
            status = response.status
            content = response.read().decode('utf-8')
            print(f"✓ {description}: {status} ({len(content)} bytes)")
            return True, content
    except Exception as e:
        print(f"✗ {description}: {e}")
        return False, None

def test_api(url, description):
    """Test if an API endpoint returns valid JSON."""
    try:
        with urllib.request.urlopen(f"{BASE_URL}{url}") as response:
            data = json.loads(response.read())
            print(f"✓ {description}: {len(data)} items")
            return True, data
    except Exception as e:
        print(f"✗ {description}: {e}")
        return False, None

print("Testing Seigr.net Pages\n" + "="*50)

# Test main pages
test_page("/", "Landing/Manifesto page")
test_page("/lab", "Lab page")
test_page("/beekeeping", "Beekeeping page")
test_page("/music", "Music page")
test_page("/lab/roadmap", "Roadmap page")

print("\n" + "="*50)
print("Testing Card Detail Pages\n" + "="*50)

# Get toolsets and test detail pages
success, toolsets = test_api("/api/toolsets", "Toolsets API")
if success and toolsets:
    for toolset in toolsets:
        slug = toolset.get('slug')
        title = toolset.get('title')
        success, content = test_page(f"/lab/toolsets/{slug}/", f"Toolset: {title}")
        if success and content:
            # Check for breadcrumb
            if "Back to Seigr Lab" in content:
                print(f"  ✓ Breadcrumb navigation present")
            else:
                print(f"  ✗ Breadcrumb navigation missing!")
            # Check for duplicate title
            if content.count(f"<h2>{title}</h2>") <= 1:
                print(f"  ✓ No duplicate title")
            else:
                print(f"  ✗ Duplicate title detected!")

# Test roadmap detail pages
print("\n" + "="*50)
print("Testing Roadmap Detail Pages\n" + "="*50)

# Manually test known roadmap items
roadmap_items = ["seigr-os", "seigr-toolset-database", "seigr-toolset-crypto"]
for slug in roadmap_items:
    success, content = test_page(f"/lab/roadmap/{slug}/", f"Roadmap: {slug}")
    if success and content:
        # Check for breadcrumb
        if "Back to Roadmap" in content:
            print(f"  ✓ Breadcrumb navigation present")
        else:
            print(f"  ✗ Breadcrumb navigation missing!")

print("\n" + "="*50)
print("Testing 404 Page\n" + "="*50)
test_page("/nonexistent", "404 page (should work)")

print("\n" + "="*50)
print("All tests completed!")
