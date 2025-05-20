import os
import re
import base64

import numpy as np
from dash import Dash, dcc, html, Input, Output
from PIL import Image
from io import BytesIO

app = Dash(__name__)
regex = r'.*img_(.*)_guid(\d*)_nsteps(\d*).*_(\d*).png'

# Function to get image filenames
def find_images(basepath):
    images = {}
    for dirname in os.listdir(basepath):
        if os.path.isdir(os.path.join(basepath, dirname)):
            for iname in os.listdir(os.path.join(basepath, dirname)):
                ipath = os.path.join(basepath, dirname, iname)
                matched = re.match(regex, ipath)
                if matched:
                    images[(matched.group(1), int(matched.group(2)), int(matched.group(3)), int(matched.group(4)))] = ipath
    return images, ('base_img', 'guidance', 'nsteps', 'variant')

def encode(image):
    with Image.open(image) as img:
        width, height = img.size
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        img_cropped = img.crop((left, top, right, bottom))
        buffered = BytesIO()
        img_cropped.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode('ascii')

# Get dict with images
# Add party selection dropdown
party_options = ['spd', 'fdp', 'cdu']
CURRENT_PARTY = party_options[0]

# Initial load
CURRENT_IMAGES, config_values = find_images(f'contents/2020/{CURRENT_PARTY}/images')
unique_configs = {}
for idx, value in enumerate(config_values):
    unique_configs[value] = list(set([key[idx] for key in CURRENT_IMAGES.keys()]))
    print(f'options for {value}:', unique_configs[value])
CURRENT_CONFIG = [option[0] for option in list(unique_configs.values())]
CURRENT_PIC = encode(CURRENT_IMAGES[tuple(CURRENT_CONFIG)])
CURRENT_BASE = encode(os.path.join('contents', f'{CURRENT_CONFIG[0]}.jpg'))

# Layout of the app
app.layout = html.Div([
    html.Div([
        html.Div([
            dcc.Dropdown(
                id='party-dropdown',
                options=[{'label': party, 'value': party} for party in party_options],
                value=CURRENT_PARTY
            ),
            dcc.Dropdown(
                id='image-dropdown',
                options=[{'label': filename, 'value': filename} for filename in unique_configs['base_img']],
                value=CURRENT_CONFIG[0]
            ),
            dcc.Slider(
                id='guidance-slider',
                min=min(unique_configs['guidance']),
                max=max(unique_configs['guidance']),
                step=1,
                value=CURRENT_CONFIG[1],
                marks={i: str(i) for i in unique_configs['guidance']},
                tooltip={"placement": "bottom", "always_visible": True},
                updatemode='drag'
            ),
            dcc.Slider(
                id='nsteps-slider',
                min=min(unique_configs['nsteps']),
                max=max(unique_configs['nsteps']),
                step=1,
                value=CURRENT_CONFIG[2],
                marks={i: str(i) for i in unique_configs['nsteps']},
                tooltip={"placement": "bottom", "always_visible": True},
                updatemode='drag'
            ),
            dcc.Slider(
                id='variant-slider',
                min=min(unique_configs['variant']),
                max=max(unique_configs['variant']),
                step=1,
                value=CURRENT_CONFIG[3],
                marks={i: str(i) for i in unique_configs['variant']},
                tooltip={"placement": "bottom", "always_visible": True},
                updatemode='drag'
            ),
            html.Label(id='image-name')
        ], style={'width': '40%', 'display': 'inline-block', 'verticalAlign': 'top', 'padding': '20px'}),
        html.Div([
            html.Div(id='image-display', style={'display': 'inline-block', 'marginRight': '20px'}),
            html.Div(id='base-display', style={'display': 'inline-block'}),
        ], style={'width': '65%', 'display': 'inline-block', 'verticalAlign': 'top'}),
    ], style={'display': 'flex', 'flexDirection': 'row', 'width': '100%'})
])

# Callback to update image display
@app.callback(
    [Output('image-display', 'children'), Output('base-display', 'children'), Output('image-name', 'children')],
    [Input('party-dropdown', 'value'), Input('image-dropdown', 'value'), Input('guidance-slider', 'value'), Input('nsteps-slider', 'value'), Input('variant-slider', 'value')]
)

def update_image(party, base, guidance, nsteps, variant):
    global CURRENT_PARTY, CURRENT_IMAGES, CURRENT_PIC, CURRENT_BASE
    if party != CURRENT_PARTY:
        CURRENT_PARTY = party
        CURRENT_IMAGES, _ = find_images(f'contents/2020/{CURRENT_PARTY}/images')
        CURRENT_PIC = encode(CURRENT_IMAGES[(base, guidance, nsteps, variant)])
    if base != CURRENT_CONFIG[0]:
        CURRENT_BASE = encode(os.path.join('contents', f'{base}.jpg'))
    elif (base, guidance, nsteps, variant) in CURRENT_IMAGES:
        CURRENT_PIC = encode(CURRENT_IMAGES[(base, guidance, nsteps, variant)])
    return html.Img(src='data:image/png;base64,{}'.format(CURRENT_PIC), style={'height': '500px'}), html.Img(src='data:image/png;base64,{}'.format(CURRENT_BASE), style={'height': '500px'}), CURRENT_IMAGES[(base, guidance, nsteps, variant)]

if __name__ == '__main__':
    app.run_server(debug=True)