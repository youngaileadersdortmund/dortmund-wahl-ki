import os
import re
import base64

import numpy as np
from dash import Dash, dcc, html, Input, Output

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
    return base64.b64encode(open(image, 'rb').read()).decode('ascii')

# Get dict with images
images, config_values = find_images('contents/2020/spd/images')
unique_configs = {}
for idx, value in enumerate(config_values):
    unique_configs[value] = list(set([key[idx] for key in images.keys()]))
    print(f'options for {value}:', unique_configs[value])
CURRENT_CONFIG = [option[0] for option in list(unique_configs.values())]
CURRENT_PIC = encode(images[tuple(CURRENT_CONFIG)])

# Layout of the app
app.layout = html.Div([
    dcc.Slider(id='guidance-slider', min=min(unique_configs['guidance']), max=max(unique_configs['guidance']), step=1, value=CURRENT_CONFIG[1], marks={i: str(i) for i in unique_configs['guidance']}, tooltip={"placement": "bottom", "always_visible": True}, updatemode='drag'),
    dcc.Slider(id='nsteps-slider', min=min(unique_configs['nsteps']), max=max(unique_configs['nsteps']), step=1, value=CURRENT_CONFIG[2], marks={i: str(i) for i in unique_configs['nsteps']}, tooltip={"placement": "bottom", "always_visible": True}, updatemode='drag'),
    dcc.Slider(id='variant-slider', min=min(unique_configs['variant']), max=max(unique_configs['variant']), step=1, value=CURRENT_CONFIG[3], marks={i: str(i) for i in unique_configs['variant']}, tooltip={"placement": "bottom", "always_visible": True}, updatemode='drag'),
    dcc.Dropdown(id='image-dropdown', options=[{'label': filename, 'value': filename} for filename in unique_configs['base_img']], value=CURRENT_CONFIG[0]),
    html.Div(id='image-display'),
])

# Callback to update image display
@app.callback(
    Output('image-display', 'children'),
    [Input('image-dropdown', 'value'), Input('guidance-slider', 'value'), Input('nsteps-slider', 'value'), Input('variant-slider', 'value')]
)

def update_image(base, guidance, nsteps, variant):
    global CURRENT_PIC
    print(base, guidance, nsteps, variant)
    if (base, guidance, nsteps, variant) in images:
        CURRENT_PIC = encode(images[(base, guidance, nsteps, variant)])
    return html.Img(src='data:image/png;base64,{}'.format(CURRENT_PIC), style={'height': '500px'})    


if __name__ == '__main__':
    app.run_server(debug=True)