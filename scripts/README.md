## Parties_metadata

After updating any prompt.txt, and/or prompt_de.txt, you can run this command in the termindal to update the parties_metadata.json in the src/frontend/public folder.

```bash
python parties_metadata.py
```

If you changed the location of the partoes_metadata.json, just update this line with the new location.

```python
JSON_PATH = os.path.join("..", "src", "frontend", "public", "parties_metadata.json")
```
